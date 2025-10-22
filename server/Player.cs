namespace SpacetimeWheel;

using SpacetimeDB;

public static partial class Module
{
	[Table(Name = "Players", Public = true)]
	public partial class Player
	{
		[PrimaryKey]
		public Identity Identity;
		public string? Name;
		public bool IsVIP = false;
		public string? Role;
	}

	[Reducer]
	public static void UpdateName(ReducerContext ctx, string name)
	{
		name = ValidateName(name);

		var allPlayers = ctx.Db.Players.Iter().ToList();

		if (ctx.Db.Players.Identity.Find(ctx.Sender) is not Player player)
		{
			return;
		}

		player.Name = name;
		player.IsVIP = !allPlayers.Any(p => p.IsVIP);

		ctx.Db.Players.Identity.Update(player);

		// Update matching game states if it contains the player by identity
		foreach (var gameState in ctx.Db.GameStates.Iter())
		{
			var playerList = gameState.Players;
			var match = playerList.FirstOrDefault(p => p.Identity == ctx.Sender);
			if (match is not null)
			{
				match.Name = name;
				gameState.Players = [.. playerList];
				ctx.Db.GameStates.Game.Update(gameState);
			}
		}
	}

	/// Takes a name and checks if it's acceptable as a player's name.
	private static string ValidateName(string name)
	{
		if (string.IsNullOrEmpty(name))
		{
			throw new Exception("Names must not be empty");
		}
		return name;
	}

}
