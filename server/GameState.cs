namespace SpacetimeWheel;

using SpacetimeDB;

public static partial class Module
{
	[Table(Name = "GameStates", Public = true)]
	public partial class GameState
	{
		[PrimaryKey]
		public string Game = "temp";
		public string State = "init";
		public string CurrentFocus = "both";

		public string PreviousTraitor = "";

		public Prompt? Prompt;
		public Player[] Players = [];
		public Vote[] Votes = [];
	}

	[Type]
	public partial class Vote
	{
		public Identity Voter;
		public Identity VotedOn;
	}

	[Reducer]
	public static void SetGameState(ReducerContext ctx, string game, string state, string focusOnDevice)
	{
		if (ctx.Db.GameStates.Game.Find(game) is GameState existingState)
		{
			existingState.State = state;
			existingState.CurrentFocus = focusOnDevice;
			ctx.Db.GameStates.Game.Update(existingState);
			return;
		}

		ctx.Db.GameStates.Insert(new GameState { Game = game, State = state });
	}

	[Reducer]
	public static void ResetVotes(ReducerContext ctx, string game)
	{
		if (ctx.Db.GameStates.Game.Find(game) is not GameState existingState)
		{
			return;
		}

		existingState.Votes = [];
		ctx.Db.GameStates.Game.Update(existingState);
	}

	[Reducer]
	public static void CastVote(ReducerContext ctx, string game, Identity votedOn)
	{
		if (ctx.Db.GameStates.Game.Find(game) is not GameState existingState)
		{
			return;
		}
		var votesList = existingState.Votes.ToList();
		var existingVote = votesList.FirstOrDefault(v => v.Voter == ctx.Sender);
		if (existingVote != null)
		{
			return;
		}
		else
		{
			votesList.Add(new Vote { Voter = ctx.Sender, VotedOn = votedOn });
		}
		existingState.Votes = [.. votesList];
		ctx.Db.GameStates.Game.Update(existingState);
	}

	[Reducer]
	public static void Join(ReducerContext ctx, string game)
	{
		if (ctx.Db.GameStates.Game.Find(game) is not GameState existingState)
		{
			return;
		}

		if (ctx.Db.Players.Identity.Find(ctx.Sender) is not Player player)
		{
			return;
		}

		var playersList = existingState.Players.ToList();
		if (playersList.Any(p => p.Identity == ctx.Sender))
		{
			return;
		}

		playersList.Add(player);
		existingState.Players = playersList.ToArray();
		ctx.Db.GameStates.Game.Update(existingState);
	}

	[Reducer]
	public static void Leave(ReducerContext ctx, string game)
	{
		Kick(ctx, game, ctx.Sender);
	}

	[Reducer]
	public static void Kick(ReducerContext ctx, string game, Identity identity)
	{
		if (ctx.Db.GameStates.Game.Find(game) is not GameState existingState)
		{
			return;
		}

		var playersList = existingState.Players.ToList();
		var playerToRemove = playersList.FirstOrDefault(p => p.Identity == identity);
		if (playerToRemove == null)
		{
			return;
		}

		playersList.Remove(playerToRemove);
		existingState.Players = [.. playersList];

		ctx.Db.GameStates.Game.Update(existingState);
	}

	[Reducer]
	public static void SetPrompt(ReducerContext ctx, string game)
	{
		if (ctx.Db.GameStates.Game.Find(game) is not GameState existingState)
		{
			return;
		}

		var promptList = ctx.Db.Prompts.Iter().ToList();
		if (promptList.Count == 0)
		{
			existingState.Prompt = new Prompt { Id = 999, LoyalText = "Le høyt", TraitorText = "Blend inn" };
		}
		else
		{
			var rand = new Random();
			int promptIndex = rand.Next(promptList.Count);
			existingState.Prompt = promptList[promptIndex];
		}

		ctx.Db.GameStates.Game.Update(existingState);
	}

	[Reducer]
	public static void AssignRoles(ReducerContext ctx, string game)
	{
		if (ctx.Db.GameStates.Game.Find(game) is not GameState existingState)
		{
			return;
		}

		var playersList = existingState.Players.ToList();

		var rand = new Random();
		int traitorIndex = rand.Next(playersList.Count);
		for (int i = 0; i < playersList.Count; i++)
		{
			if (i == traitorIndex)
			{
				playersList[i].Role = "traitor";
				existingState.PreviousTraitor = playersList[i].Name!;
			}
			else
			{
				playersList[i].Role = "loyal";
			}
		}

		existingState.Players = [.. playersList];
		ctx.Db.GameStates.Game.Update(existingState);

		// Update matching player states
		foreach (var player in ctx.Db.Players.Iter())
		{
			var match = playersList.FirstOrDefault(p => p.Identity == player.Identity);
			if (match is not null)
			{
				player.Role = match.Role;
				ctx.Db.Players.Identity.Update(player);
			}
		}

	}
}
