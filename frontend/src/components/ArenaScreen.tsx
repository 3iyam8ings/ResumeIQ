import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ArenaScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const [liveCoins, setLiveCoins] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const restartGame = () => {
    setGameOver(false);
    setShowInstructions(true);
    setCoinsEarned(0);
    setLiveCoins(0);
    if (iframeRef.current) {
      iframeRef.current.src = "/mario/index.html";
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data) {
        if (event.data.type === 'GAME_OVER') {
          setCoinsEarned(event.data.coins || 0);
          setGameOver(true);
        } else if (event.data.type === 'COIN_UPDATE') {
          setLiveCoins(event.data.coins || 0);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          
          .pixel-shadow {
            box-shadow: 
              4px 4px 0px 0px #000,
              8px 8px 0px 0px rgba(0,0,0,0.5);
          }
          
          .arcade-header {
            background: linear-gradient(180deg, #E52521 0%, #B31B18 100%);
            border-bottom: 6px solid #000;
            padding: 24px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .pixel-text {
            font-family: 'Press Start 2P', cursive;
            color: #F8E71C; /* Coin Yellow */
            margin: 0;
            font-size: 20px;
            text-transform: uppercase;
            text-shadow: 4px 4px 0px #000;
            letter-spacing: 2px;
            line-height: 1.5;
          }
          
          .retro-button {
            background-color: #43B047; /* Pipe Green */
            color: #fff;
            border: 4px solid #000;
            padding: 12px 24px;
            font-family: 'Press Start 2P', cursive;
            font-size: 10px;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 4px 4px 0px 0px #000;
            transition: all 0.1s;
            text-shadow: 2px 2px 0px #000;
          }
          
          .retro-button:hover {
            transform: translate(4px, 4px);
            box-shadow: 0px 0px 0px 0px #000;
            background-color: #55D65A;
          }
          
          .game-container {
            width: 100%;
            maxWidth: 1200px;
            height: 75vh;
            background-color: #000;
            border: 8px solid #E52521;
            border-radius: 8px;
            box-shadow: 
              0 0 0 4px #000,
              8px 8px 0px 4px #000,
              12px 12px 24px rgba(0,0,0,0.8);
            overflow: hidden;
            position: relative;
          }
        `}
      </style>

      <div className="arcade-header">
        <h1 className="pixel-text">
          SUPER MARIO ARENA
        </h1>
        <button
          onClick={() => navigate('/home')}
          className="retro-button"
        >
          BACK TO DASHBOARD
        </button>
      </div>

      <div style={{ flex: 1, padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundImage: 'radial-gradient(#374151 2px, transparent 2px)', backgroundSize: '32px 32px' }}>

        {/* Left Side Instructions Panel */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="pixel-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', fontSize: '10px', lineHeight: '1.8', color: '#fff' }}>
            <span style={{ color: '#F8E71C', fontSize: '14px', marginBottom: '8px' }}>Keyboard Controls:</span>
            <span><span style={{ color: '#E52521' }}>W</span> - Move Up (used for climbing or swimming)</span>
            <span><span style={{ color: '#E52521' }}>A</span> - Move Left</span>
            <span><span style={{ color: '#E52521' }}>D</span> - Move Right</span>
            <span><span style={{ color: '#E52521' }}>S</span> - Move Down / Enter Pipes!</span>
            <span><span style={{ color: '#3b82f6' }}>P</span> - Jump</span>
            <span><span style={{ color: '#43B047' }}>O</span> - Run / Sprint / Fireballs (if you have the fire flower)</span>
            <span style={{ color: '#ffb9b7', fontSize: '8px', marginTop: '16px', maxWidth: '250px', lineHeight: '1.5' }}>
              * DISCLAIMER: Only desktop users can play this game. Not available for mobile users. Sorry!
            </span>
          </div>
        </div>

        <div className="game-container" style={{ flex: 'none', width: '800px', height: '600px', position: 'relative' }}>
          {showInstructions && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontFamily: '"Press Start 2P", cursive',
              textAlign: 'center',
              padding: '32px'
            }}>
              <h2 style={{ color: '#F8E71C', marginBottom: '16px', fontSize: '24px', textShadow: '4px 4px 0px #000' }}>HOW TO PLAY</h2>

              <p style={{ color: '#ffb9b7', fontSize: '10px', marginBottom: '24px', maxWidth: '80%', lineHeight: '1.5' }}>
                * DISCLAIMER: Only desktop users can play this game. Not available for mobile users. Sorry!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '12px', lineHeight: '2', marginBottom: '48px', textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.5)', padding: '24px', border: '4px solid #fff', borderRadius: '8px' }}>
                <div><span style={{ color: '#43B047' }}>CLICK SCREEN</span> to start / focus</div>
                <div><span style={{ color: '#E52521' }}>W, A, S, D</span> to Move / Enter Pipes (S)</div>
                <div><span style={{ color: '#F8E71C' }}>P</span> to Jump (Hold to jump higher)</div>
                <div><span style={{ color: '#3b82f6' }}>O</span> to Sprint (Hold while jumping for max distance)</div>
              </div>

              <button
                className="retro-button"
                style={{ fontSize: '16px', padding: '16px 32px' }}
                onClick={() => setShowInstructions(false)}
              >
                DOUBLE TAP TO PLAY
              </button>
            </div>
          )}

          {gameOver && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontFamily: '"Press Start 2P", cursive',
              textAlign: 'center',
              padding: '32px'
            }}>
              <h2 style={{ color: '#E52521', marginBottom: '16px', fontSize: '32px', textShadow: '4px 4px 0px #000' }}>GAME OVER</h2>
              <div style={{ color: '#F8E71C', marginBottom: '48px', fontSize: '16px', textShadow: '2px 2px 0px #000' }}>TIME'S UP!</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '16px 32px', border: '4px solid #F8E71C', borderRadius: '8px' }}>
                <span style={{ fontSize: '24px', color: '#F8E71C' }}>COINS EARNED:</span>
                <span style={{ fontSize: '32px', color: '#fff' }}>{coinsEarned}</span>
              </div>

              <button
                className="retro-button"
                style={{ fontSize: '16px', padding: '16px 32px', backgroundColor: '#3b82f6' }}
                onClick={restartGame}
              >
                PLAY AGAIN
              </button>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src="/mario/index.html"
            title="Super Mario Arena"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>

        {/* Right Side Coin Panel */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div className="pixel-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#fff', fontSize: '24px' }}>COINS</span>
            <span style={{ color: '#F8E71C', fontSize: '48px', textShadow: '4px 4px 0px #000' }}>{liveCoins}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
