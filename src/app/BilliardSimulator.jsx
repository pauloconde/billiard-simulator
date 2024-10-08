'use client'

import React, { useState, useEffect, useRef } from 'react';

const TABLE_WIDTH = 800;
const TABLE_HEIGHT = 400;
const BORDER_WIDTH = 40;
const CUSHION_WIDTH = 10;
const BALL_DIAMETER = 17;
const DIAMOND_SIZE = 8;
const MAX_VELOCITY = 5;

export default function BilliardSimulator() {
    const canvasRef = useRef(null);
    const [balls, setBalls] = useState([
        { x: TABLE_WIDTH / 4, y: TABLE_HEIGHT / 2, vx: 0, vy: 0, color: 'white' },
        { x: TABLE_WIDTH / 2, y: TABLE_HEIGHT / 2, vx: 0, vy: 0, color: 'yellow' },
        { x: (3 * TABLE_WIDTH) / 4, y: TABLE_HEIGHT / 2, vx: 0, vy: 0, color: 'red' },
    ]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        drawTable(ctx);
        drawDiamonds(ctx);
        balls.forEach((ball) => {
            drawBall(ctx, ball);
            drawTrajectory(ctx, ball);
        });
    }, [balls]);

    const drawTable = (ctx) => {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, TABLE_WIDTH + 2 * BORDER_WIDTH, TABLE_HEIGHT + 2 * BORDER_WIDTH);
        ctx.fillStyle = '#0A7BD1FF';
        ctx.fillRect(30, 30, TABLE_WIDTH + 2 * CUSHION_WIDTH, TABLE_HEIGHT + 2 * CUSHION_WIDTH);
        ctx.fillStyle = '#264FD5FF';
        ctx.fillRect(BORDER_WIDTH, BORDER_WIDTH, TABLE_WIDTH, TABLE_HEIGHT);
    };

    const drawDiamonds = (ctx) => {
        ctx.fillStyle = 'white';

        const drawDiamond = (x, y) => {
            ctx.beginPath();
            ctx.moveTo(x, y - DIAMOND_SIZE / 2);
            ctx.lineTo(x + DIAMOND_SIZE / 2, y);
            ctx.lineTo(x, y + DIAMOND_SIZE / 2);
            ctx.lineTo(x - DIAMOND_SIZE / 2, y);
            ctx.closePath();
            ctx.fill();
        };

        for (let i = 0; i < 9; i++) {
            const x = BORDER_WIDTH + (i * TABLE_WIDTH) / 8;
            drawDiamond(x, (BORDER_WIDTH - CUSHION_WIDTH) / 2);
            drawDiamond(x, TABLE_HEIGHT + (BORDER_WIDTH * 1.5) + (CUSHION_WIDTH / 2));
        }

        for (let i = 0; i < 5; i++) {
            const y = BORDER_WIDTH + (i * TABLE_HEIGHT) / 4;
            drawDiamond((BORDER_WIDTH - CUSHION_WIDTH) / 2, y);
            drawDiamond(TABLE_WIDTH + (BORDER_WIDTH * 1.5) + (CUSHION_WIDTH / 2), y);
        }
    };

    const drawBall = (ctx, ball) => {
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x + BORDER_WIDTH, ball.y + BORDER_WIDTH, BALL_DIAMETER / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ball.x + BORDER_WIDTH + 2, ball.y + BORDER_WIDTH + 2, BALL_DIAMETER / 2 - 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fill();
    };

    // const drawTrajectory = (ctx, ball) => {
    //     let x = ball.x;
    //     let y = ball.y;
    //     let vx = ball.vx;
    //     let vy = ball.vy;
    //     const maxBounces = 5;
    //     let bounces = 0;

    //     ctx.beginPath();
    //     ctx.moveTo(x + BORDER_WIDTH, y + BORDER_WIDTH);
    //     ctx.strokeStyle = ball.color;

    //     while (bounces < maxBounces) {
    //         const tX = vx !== 0 ? (vx > 0 ? TABLE_WIDTH - x : -x) / vx : Infinity;
    //         const tY = vy !== 0 ? (vy > 0 ? TABLE_HEIGHT - y : -y) / vy : Infinity;
    //         const t = Math.min(tX, tY);

    //         x += vx * t;
    //         y += vy * t;

    //         ctx.lineTo(x + BORDER_WIDTH, y + BORDER_WIDTH);

    //         if (t === tX) {
    //             vx = -vx;
    //         } else {
    //             vy = -vy;
    //         }

    //         bounces++;
    //     }

    //     ctx.stroke();
    // };

    const drawTrajectory = (ctx, ball) => {
        let x = ball.x;
        let y = ball.y;
        let vx = ball.vx;
        let vy = ball.vy;
    
        // Calcular la magnitud de la velocidad
        const speed = Math.sqrt(vx * vx + vy * vy);
    
        // Establecer la longitud total de la trayectoria basada en la velocidad
        const trajectoryLength = speed * 800; // Ajusta el factor según la escala que quieras
    
        const maxBounces = 8; // Establece el número máximo de rebotes que puede hacer la bola
        let currentLength = 0;
        let bounces = 0;
    
        ctx.beginPath();
        ctx.moveTo(x + BORDER_WIDTH, y + BORDER_WIDTH);
    
        // Bucle para manejar los rebotes en las bandas
        while (currentLength < trajectoryLength && bounces < maxBounces) {
            // Calcular el tiempo hasta el próximo rebote
            let timeToWallX = Infinity;
            let timeToWallY = Infinity;
    
            if (vx > 0) {
                timeToWallX = (TABLE_WIDTH - x) / vx;
            } else if (vx < 0) {
                timeToWallX = -x / vx;
            }
    
            if (vy > 0) {
                timeToWallY = (TABLE_HEIGHT - y) / vy;
            } else if (vy < 0) {
                timeToWallY = -y / vy;
            }
    
            // Determinar cuál será el próximo rebote (en el eje X o Y)
            let timeToWall = Math.min(timeToWallX, timeToWallY);
    
            // Actualizar la posición de la bola hasta la pared
            x += vx * timeToWall;
            y += vy * timeToWall;
            currentLength += Math.sqrt(vx * vx + vy * vy) * timeToWall;
    
            // Dibujar hasta la nueva posición
            ctx.lineTo(x + BORDER_WIDTH, y + BORDER_WIDTH);
    
            // Verificar el rebote
            if (timeToWall === timeToWallX) {
                vx = -vx; // Rebote en la pared vertical
            } else {
                vy = -vy; // Rebote en la pared horizontal
            }
    
            bounces += 1; // Incrementar el contador de rebotes
        }
    
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';  // Color de la línea de trayectoria
        ctx.lineWidth = 2;
        ctx.stroke();
    };
    
    

    const handleBallChange = (index, field, value) => {
        setBalls((prevBalls) =>
            prevBalls.map((ball, i) => {
                if (i === index) {
                    const updatedBall = { ...ball, [field]: value };
                    if (field === 'vx' || field === 'vy') {
                        updatedBall[field] = Math.min(Math.max(value, -MAX_VELOCITY), MAX_VELOCITY);
                    }
                    return updatedBall;
                }
                return ball;
            })
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
            <canvas
                ref={canvasRef}
                width={TABLE_WIDTH + 2 * BORDER_WIDTH}
                height={TABLE_HEIGHT + 2 * BORDER_WIDTH}
                className="border border-gray-900 shadow-lg mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {balls.map((ball, index) => (
                    <div key={index} className="bg-white p-4 rounded shadow text-black">
                        <h3 className="font-bold mb-2">{ball.color.charAt(0).toUpperCase() + ball.color.slice(1)} Ball</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex flex-col">
                                X:
                                <input
                                    type="number"
                                    value={ball.x}
                                    onChange={(e) => handleBallChange(index, 'x', Number(e.target.value))}
                                    className="border rounded px-2 py-1"
                                />
                            </label>
                            <label className="flex flex-col">
                                Y:
                                <input
                                    type="number"
                                    value={ball.y}
                                    onChange={(e) => handleBallChange(index, 'y', Number(e.target.value))}
                                    className="border rounded px-2 py-1"
                                />
                            </label>
                            <label className="flex flex-col">
                                Velocity X (-5 to 5):
                                <input
                                    type="number"
                                    value={ball.vx}
                                    onChange={(e) => handleBallChange(index, 'vx', Number(e.target.value))}
                                    className="border rounded px-2 py-1"
                                    step="0.1"
                                    min="-5"
                                    max="5"
                                />
                            </label>
                            <label className="flex flex-col">
                                Velocity Y (-5 to 5):
                                <input
                                    type="number"
                                    value={ball.vy}
                                    onChange={(e) => handleBallChange(index, 'vy', Number(e.target.value))}
                                    className="border rounded px-2 py-1"
                                    step="0.1"
                                    min="-5"
                                    max="5"
                                />
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}