import { Gamepad2 } from 'lucide-react';

const gameLogos = [
  {
    src: '/assets/generated/subway-surfers-logo.dim_512x512.png',
    alt: 'Subway Surfers Game Logo',
    title: 'Subway Surfers',
    url: 'https://poki.com/en/g/subway-surfers',
  },
  {
    src: '/assets/generated/ludo-logo.dim_512x512.png',
    alt: 'Ludo Game Logo',
    title: 'Ludo',
    url: 'https://poki.com/en/g/ludo-multiplayer',
  },
  {
    src: '/assets/generated/chess-logo.dim_512x512.png',
    alt: 'Chess Game Logo',
    title: 'Chess',
    url: 'https://poki.com/en/g/master-chess',
  },
  {
    src: '/assets/generated/hill-climb-race-logo.dim_512x512.png',
    alt: 'Hill Climb Race Game Logo',
    title: 'Hill Climb Race',
    url: 'https://poki.com/en/g/hill-climb-racing-lite',
  },
  {
    src: '/assets/generated/escape-the-prison-logo.dim_512x512.png',
    alt: 'Escape the prison Game Logo',
    title: 'Escape the prison',
    url: 'https://poki.com/en/g/escaping-the-prison',
  },
  {
    src: '/assets/generated/devils-call-logo.dim_512x512.png',
    alt: 'Devils call Game Logo',
    title: 'Devils call',
    url: 'https://poki.com/en/g/level-devil',
  },
];

export default function GamePage() {
  const handleGameClick = (url: string | null) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, url: string | null) => {
    if ((e.key === 'Enter' || e.key === ' ') && url) {
      e.preventDefault();
      handleGameClick(url);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
            <Gamepad2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Games
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We created this space for our employees to unwind, recharge, and enjoy meaningful moments of relaxation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {gameLogos.map((game, index) => {
            const isClickable = game.url !== null;
            const CardWrapper = isClickable ? 'button' : 'div';

            return (
              <CardWrapper
                key={index}
                onClick={isClickable ? () => handleGameClick(game.url) : undefined}
                onKeyDown={isClickable ? (e) => handleKeyDown(e, game.url) : undefined}
                className={`group relative bg-card rounded-2xl overflow-hidden border-2 border-border/40 hover:border-primary/60 motion-safe:transition-all motion-safe:duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/20 w-full text-left ${
                  isClickable ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2' : ''
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                tabIndex={isClickable ? 0 : undefined}
                aria-label={isClickable ? `Play ${game.title}` : undefined}
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
                  <img
                    src={game.src}
                    alt={game.alt}
                    className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 motion-safe:group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-300" />
                  {isClickable && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 motion-safe:group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-300">
                      <div className="bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                        Play Now
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary motion-safe:transition-colors">
                    {game.title}
                  </h3>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
}
