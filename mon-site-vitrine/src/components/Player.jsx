import React, { useState, useEffect, useMemo } from "react";
import "./Player.css";

// Constantes de physique et dimensions
const GRAVITY = 0.5;
const JUMP_VELOCITY = -10;
const MOVE_SPEED = 5;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;

function Player() {
    // Position et vélocité
    const [position, setPosition] = useState({ x: 100, y: 300 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isJumping, setIsJumping] = useState(false);
    // Action : "idle", "run", "jump" (pour choisir le sprite)
    const [action, setAction] = useState("idle");

    // Définition de quelques plateformes (en pixels)
    // La première plateforme représente le sol
    const platforms = useMemo(() => [
        { x: 0, y: 350, width: 800, height: 50 },
        { x: 150, y: 250, width: 200, height: 20 },
        { x: 400, y: 200, width: 150, height: 20 },
    ], []);

    // Gestion des touches (AZERTY : Q = gauche, D = droite, Z = sauter)
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            if (key === "q") {
                setVelocity((v) => ({ ...v, x: -MOVE_SPEED }));
            } else if (key === "d") {
                setVelocity((v) => ({ ...v, x: MOVE_SPEED }));
            } else if (key === "z") {
                if (!isJumping) {
                    setVelocity((v) => ({ ...v, y: JUMP_VELOCITY }));
                    setIsJumping(true);
                }
            }
        };

        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            if (key === "q" || key === "d") {
                setVelocity((v) => ({ ...v, x: 0 }));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [isJumping]);


    // Boucle d'animation pour mettre à jour la position, appliquer la gravité et gérer les collisions
    useEffect(() => {
        let animationFrameId;

        const update = () => {
            // Mise à jour de la vélocité avec la gravité
            setVelocity((v) => ({ ...v, y: v.y + GRAVITY }));

            setPosition((pos) => {
                let newX = pos.x + velocity.x;
                let newY = pos.y + velocity.y;

                // Limiter la position horizontale pour ne pas sortir de l'écran
                newX = Math.max(0, Math.min(newX, window.innerWidth - PLAYER_WIDTH));

                // Vérifier la collision avec le sol (plateforme principale)
                for (let platform of platforms) {
                    if (
                        newX < platform.x + platform.width &&
                        newX + PLAYER_WIDTH > platform.x
                    ) {
                        if (
                            velocity.y > 0 &&
                            pos.y + PLAYER_HEIGHT <= platform.y &&
                            newY + PLAYER_HEIGHT >= platform.y
                        ) {
                            newY = platform.y - PLAYER_HEIGHT;
                            setVelocity((v) => ({ ...v, y: 0 }));
                            setIsJumping(false);
                        }
                    }
                }

                // Si le personnage tombe en dessous d'une certaine limite (par exemple, le sol virtuel)
                if (newY > 500) { // Ajuste cette valeur en fonction de ton design
                    newY = 500;
                    setVelocity((v) => ({ ...v, y: 0 }));
                    setIsJumping(false);
                }

                // Mise à jour de l'action (idle, run, jump)
                if (velocity.y !== 0) {
                    setAction("jump");
                } else if (velocity.x !== 0) {
                    setAction("run");
                } else {
                    setAction("idle");
                }

                return { x: newX, y: newY };
            });

            animationFrameId = requestAnimationFrame(update);
        };

        animationFrameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrameId);
    }, [velocity.x, velocity.y, platforms]);

    // Définition des sprites en fonction de l'action
    const sprites = {
        idle: "/images/player_idle.png",
        run: "/images/player_run.png",
        jump: "/images/player_jump.png",
    };

    return (
        <div className="player" style={{ left: position.x, top: position.y }}>
            <img src={sprites[action]} alt="Player" />
        </div>
    );
}

export default Player;
