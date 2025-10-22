namespace SpacetimeWheel;

using SpacetimeDB;

public static partial class Module
{
	[Reducer(ReducerKind.ClientConnected)]
	public static void ClientConnected(ReducerContext ctx)
	{
		Log.Info($"Connect {ctx.Sender}");

		if (ctx.Db.Players.Identity.Find(ctx.Sender) is Player user)
		{
			ctx.Db.Players.Identity.Update(user);
			return;
		}

		// If this is a new user, create a `Player` object for the `Identity`,
		// which is online, but hasn't set a name.
		ctx.Db.Players.Insert(
			new Player
			{
				Name = null,
				Identity = ctx.Sender,
			}
		);
	}

	[Reducer(ReducerKind.ClientDisconnected)]
	public static void ClientDisconnected(ReducerContext ctx)
	{
		//foreach (var gameState in ctx.Db.GameStates.Iter())
		//{
		//	if (gameState.Players.Any(p => p.Identity == ctx.Sender))
		//	{
		//		gameState.Players = [.. gameState.Players.Where(p => p.Identity != ctx.Sender)];
		//		ctx.Db.GameStates.Game.Update(gameState);
		//	}
		//}
	}
}
