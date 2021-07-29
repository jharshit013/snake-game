import React, {useEffect, useState} from 'react';
import {randomNumGenerator,reverseLinkedList,useInterval} from '../utils/utils.js';

import './GameMat.css'

class Node{
    constructor(val){
        this.val=val;
        this.next=null;
    }
}

class LinkedList{
    constructor(val){
        const node=new Node(val);
        this.head=node;
        this.tail=node;
    }
}

class Cell{
    constructor(row,col,val){
        this.row=row;
        this.col=col;
        this.val=val;
    }
}

const Movements={
    UP:'UP',
    LEFT:'LEFT',
    DOWN:'DOWN',
    RIGHT:'RIGHT',
};

const GAMEMAT_SIZE=15;

const getStartingSnakeValue=mat=>{
    const rowLength=mat.length;
    const colLength=mat[0].length;
    const startRow=Math.round(rowLength/3);
    const startCol=Math.round(colLength/3);
    const startCell=mat[startRow][startCol];
    return{
        row: startRow,
        col: startCol,
        cell: startCell,
    }
}
// const PROB_OF_DIRECTION_REVERSAL_FOOD=0.3;

const GameMat=()=>{
    const [score,setScore]=useState(0);
    const [mat,setMat]=useState(makeMat(GAMEMAT_SIZE));
    const [snake, setSnake]=useState(new LinkedList(getStartingSnakeValue(mat)));
    const [snakeCells,setSnakeCells]=useState(new Set([snake.head.val.cell]));
    const [foodCell,setFoodCell]=useState(snake.head.val.cell+5);
    const [direction, setDirection]=useState(Movements.RIGHT);


    useEffect(()=>{
        setInterval(()=>{
            // moveSnake();
        }, 1000);

        window.addEventListener('keydown',e=>{
            const newDirection=getDirectionFromKey(e.key);
            const isValidDirection=newDirection!=='';
            if(isValidDirection) setDirection(newDirection);
        })
    },[]);

    const moveSnake=()=>{
        // const currSnakeHead=snake.head;
        const currSnakeHeadCords={
            row: snake.head.val.row,
            col: snake.head.val.col,
        };

        const nextSnakeHeadCords=getNextSnakeHeadCords(currSnakeHeadCords,direction);
        
        if(isOutOfMat(nextSnakeHeadCords,mat)){
            handleGameOver();
            return;
        } 
        
        const nextSnakeHeadValue=mat[nextSnakeHeadCords.row][nextSnakeHeadCords.col];
        
        if(snakeCells.has(nextSnakeHeadValue)){
            handleGameOver();
            return;
        }

        const isFoodEaten= nextSnakeHeadValue===foodCell;
        if(isFoodEaten){
            handleFoodEaten();
            // handleGrowth(nextSnakeHeadCords);
        } 

        const newSnakeHead=new Node({
            row: nextSnakeHeadCords.row,
            col: nextSnakeHeadCords.col,
            cell: nextSnakeHeadValue,
        });
        
        const newSnakeCells=new Set(snakeCells);
        newSnakeCells.delete(snake.tail.val.cell);
        newSnakeCells.add(nextSnakeHeadValue)
        
        snake.head=newSnakeHead;

        if(!isFoodEaten){
            snake.tail=snake.tail.next;
            if(snake.tail===null) snake.tail=snake.head;
        }

        setSnakeCells(newSnakeCells)
    };

    const getNextSnakeHeadCords=(currSnakeHeadCords,direction)=>{
        if(direction===Movements.UP){
            return {
                row: currSnakeHeadCords.row-1,
                col: currSnakeHeadCords.col,
            };
        }
        if(direction===Movements.LEFT){
            return {
                row: currSnakeHeadCords.row,
                col: currSnakeHeadCords.col-1,
            };
        }
        if(direction===Movements.DOWN){
            return {
                row: currSnakeHeadCords.row+1,
                col: currSnakeHeadCords.col,
            };
        }
        if(direction===Movements.RIGHT){
            return {
                row: currSnakeHeadCords.row,
                col: currSnakeHeadCords.col+1,
            };
        }
    };

    const handleFoodEaten=()=>{
        const totalCells=GAMEMAT_SIZE*GAMEMAT_SIZE;
        let nextFoodCell;
        while(true){
            nextFoodCell=randomNumGenerator(1,totalCells);
            if(snakeCells.has(nextFoodCell)||foodCell===nextFoodCell) continue;
            break;
        }
        setFoodCell(nextFoodCell);
        setScore(score+1);
    }

    const handleGrowth=(nextSnakeHeadCords)=>{
        const nextSnakeHeadValue=mat[nextSnakeHeadCords.row][nextSnakeHeadCords.col];
        const newSnakeHead=new Node({
            row: nextSnakeHeadCords.row,
            col: nextSnakeHeadCords.col,
            cell: nextSnakeHeadValue,
        });
    }

    const handleGameOver=()=>{
        setScore(0);
        const snakeStartVal=getStartingSnakeValue(mat);
        setSnake(new LinkedList(snakeStartVal));
        setSnakeCells(new Set([snakeStartVal.cell]));
        setFoodCell(snakeStartVal.cell+5);;
        setDirection(Movements.RIGHT);
    }

    return (
        <>
        <h1>Score:{score}</h1>
        <button onClick={()=>moveSnake()}>Manual</button>
        <div className="mat">
            {mat.map((row,rowIndex)=>(
                <div kew={rowIndex} className="row">{
                    row.map((cellValue,cellIndex)=>(
                        <div key={cellIndex} className={`cell ${snakeCells.has(cellValue) ? 'snake-cell': ''} ${foodCell===cellValue?'food-cell':''}`}>{cellValue}</div>
                    ))
                }</div>
            ))}
        </div>
        </>
    );
};

const makeMat=GAMEMAT_SIZE=>{
    let c=1;
    const mat=[];
    for(let i=0;i<GAMEMAT_SIZE;i++){
        const currRow=[];
        for(let j=0;j<GAMEMAT_SIZE;j++){
            currRow.push(c++);
        }
        mat.push(currRow);
    }
    return mat;
    // return new Array(GAMEMAT_SIZE).fill(0).map(row=>new Array(GAMEMAT_SIZE).fill(0))

};

const getDirectionFromKey=key=>{
    if(key==='ArrowUp') return Movements.UP;
    if(key==='ArrowLeft') return Movements.LEFT;
    if(key==='ArrowDown') return Movements.DOWN;
    if(key==='ArrowRight') return Movements.RIGHT;
    return '';
    // if(key==='ArrowDown') return Movements.DOWN;
};

const isOutOfMat=(coords,mat)=>{
    const {row,col}=coords;
    if(row<0 || col<0 || row>=mat.length || col>=mat.length) return true;
    return false;
}

export default GameMat;

