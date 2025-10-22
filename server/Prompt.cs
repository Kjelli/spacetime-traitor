namespace SpacetimeWheel;

using SpacetimeDB;

public static partial class Module
{
	[Table(Name = "Prompts", Public = true)]
	public partial class Prompt
	{
		[PrimaryKey]
		public uint Id;
		public string TraitorText = "";
		public string LoyalText = "";
	}

	[Reducer]
	public static void AddPrompt(ReducerContext ctx, string loyalText, string traitorText)
	{
		// Guard against duplicate text:
		var allPrompts = ctx.Db.Prompts.Iter().ToList();
		if (allPrompts.Any(p => p.TraitorText == traitorText && p.LoyalText == loyalText))
		{
			return;
		}

		var nextId = allPrompts.Count == 0 ? 0 : allPrompts.Max(p => p.Id) + 1;
		ctx.Db.Prompts.Insert(new Prompt { Id = nextId, TraitorText = traitorText, LoyalText = loyalText });
	}

	[Reducer]
	public static void DeletePrompt(ReducerContext ctx, uint id)
		=> ctx.Db.Prompts.Id.Delete(id);
}
