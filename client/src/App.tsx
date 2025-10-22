import { useState, useEffect } from "react";
import DesktopScreen from "./components/desktop/DesktopScreen";
import MobileScreen from "./components/mobile/MobileScreen";
import { DbConnection, GameState, Player, Prompt } from "./module_bindings";
import { useSpacetimeDB, useTable } from "spacetimedb/react";
import LoadingView from "./components/LoadingView";

const game: string = import.meta.env.VITE_GAME || "temp";

export default function MainScreen() {
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [players, setPlayers] = useState<Player[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const conn = useSpacetimeDB<DbConnection>();

  const { identity, isActive: connected } = conn;

  useEffect(() => {
    if (!connected) return;
    const subs = [
      conn.subscriptionBuilder().subscribe("SELECT * FROM GameStates"),
      conn.subscriptionBuilder().subscribe("SELECT * FROM Players"),
      conn.subscriptionBuilder().subscribe("SELECT * FROM Prompts"),
    ];
    return () => subs.forEach((s) => s.unsubscribe());
  }, [conn, connected]);

  // Gamestate subscription
  const { rows: gameStateFromDb } = useTable<DbConnection, GameState>(
    "gameStates",
    {
      onInsert: (gameState) => {
        setGameState(gameState);
      },
      onUpdate: (_oldState, newState) => {
        setGameState(newState);
      },
      onDelete: () => setGameState(undefined),
    }
  );

  useEffect(() => {
    const gameState = gameStateFromDb.filter((gs) => gs.game === game)[0];
    setGameState(gameState);
  }, [gameStateFromDb]);

  // Players subscription
  const { rows: playersFromDb } = useTable<DbConnection, Player>("players", {
    onInsert: (player) => {
      // Don't add if already existing somehow
      if (players.find((f) => f.identity.isEqual(player.identity))) {
        return;
      }

      setPlayers([...players, player]);
    },
    onUpdate: (oldPlayer, newPlayer) => {
      setPlayers([
        ...players.filter((p) => !p.identity.isEqual(oldPlayer.identity)),
        newPlayer,
      ]);
    },
    onDelete: (player) => {
      setPlayers(players.filter((u) => !u.identity.isEqual(player.identity)));
    },
  });

  useEffect(() => {
    setPlayers([...playersFromDb]);
  }, [playersFromDb]);

  // Prompts subscription
  const { rows: promptsFromDb } = useTable<DbConnection, Prompt>("prompts", {
    onInsert: (prompt) => {
      console.log("INSERT PROMPT", prompt);
      // Don't add if already existing somehow
      if (prompts.find((p) => p.id == prompt.id)) {
        return;
      }

      setPrompts([...prompts, prompt]);
    },
    onUpdate: (oldPrompt, newPrompt) => {
      console.log("UPDATE PROMPT", newPrompt);
      setPrompts([...prompts.filter((p) => p.id !== oldPrompt.id), newPrompt]);
    },
    onDelete: (prompt) => {
      console.log("DELETE PROMPT", prompt);
      setPrompts(prompts.filter((p) => p.id !== prompt.id));
    },
  });

  useEffect(() => {
    setPrompts([...promptsFromDb]);
  }, [promptsFromDb]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Resolve local player
  useEffect(() => {
    if (!identity) return;

    const player = players.find((p) => p.identity.isEqual(identity));
    if (!player) return;

    setPlayer(player);
  }, [identity, players]);

  // Connection loading and local identity resolution
  if (!connected || !player) {
    return <LoadingView />;
  }

  const changeName = (name: string): void => {
    conn.reducers.updateName(name);
  };

  const changeState = (state: string, focusOnDevice: string): void => {
    conn.reducers.setGameState(game, state, focusOnDevice);
  };

  const assignRoles = (): void => {
    conn.reducers.assignRoles(game);
  };

  const setPrompt = (): void => {
    conn.reducers.setPrompt(game);
  };

  const addPrompt = (loyalText: string, traitorText: string): void => {
    conn.reducers.addPrompt(loyalText, traitorText);
  };

  const castVote = (votedFor: Player): void => {
    conn.reducers.castVote(game, votedFor.identity);
  };

  const resetVotes = (): void => {
    conn.reducers.resetVotes(game);
  };

  const kick = (player: Player): void => {
    conn.reducers.kick(game, player.identity);
  };

  const join = (): void => {
    conn.reducers.join(game);
  };

  const leave = (): void => {
    conn.reducers.leave(game);
  };

  return isDesktop ? (
    <DesktopScreen
      players={players}
      prompts={prompts}
      gameState={gameState}
      setPrompt={setPrompt}
      assignRoles={assignRoles}
      changeState={changeState}
      resetVotes={resetVotes}
      kick={kick}
    />
  ) : (
    <MobileScreen
      player={player}
      players={players}
      gameState={gameState}
      join={join}
      leave={leave}
      changeName={changeName}
      changeState={changeState}
      addPrompt={addPrompt}
      castVote={castVote}
    />
  );
}
