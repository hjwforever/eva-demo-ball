import resources from './resources';

import { Game, GameObject, resource, LOAD_EVENT } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { Img, ImgSystem } from '@eva/plugin-renderer-img';
import { EventSystem } from '@eva/plugin-renderer-event';
import { SpriteAnimationSystem, SpriteAnimation } from '@eva/plugin-renderer-sprite-animation';
import { RenderSystem } from '@eva/plugin-renderer-render';
import { TransitionSystem, Transition } from '@eva/plugin-transition';
import { GraphicsSystem } from '@eva/plugin-renderer-graphics';
import { TextSystem } from '@eva/plugin-renderer-text';
import createBtn from './btn';

declare global {
  interface Window {
    playAnim: any;
  }
}


resource.addResource(resources);

// 资源预加载
// resource.preload();
resource.on(LOAD_EVENT.START, e => {
  console.log('start', e);
}); // 开始loader
resource.on(LOAD_EVENT.PROGRESS, e => {
  console.log('progress', e);
  // document.querySelector('.loaded').style.width = e.progress + '%';
  // document.querySelector('.text').innerHTML = parseInt(e.progress) + '%';
  // document.querySelector('.point').style.left = `calc(${e.progress}% - 10vw)`;
}); // 加载进度更新
resource.on(LOAD_EVENT.LOADED, e => {
  console.log('LOADED', e);
}); // 某文件加载成功
resource.on(LOAD_EVENT.COMPLETE, e => {
  console.log('COMPLETE', e);
}); // 加载进度更新
resource.on(LOAD_EVENT.ERROR, e => {
  console.log('error', e);
}); // 某文件加载失败

const game = new Game({
  systems: [
    new RendererSystem({
      canvas: document.querySelector('#canvas'),
      width: 750,
      height: 1642,
      antialias: true,
    }),
    new ImgSystem(),
    new TransitionSystem(),
    new SpriteAnimationSystem(),
    new RenderSystem(),
    new EventSystem(),
    new GraphicsSystem(),
    new TextSystem(),
  ],
});

game.scene.transform.size.width = 750;
game.scene.transform.size.height = 1642;

// 添加背景
function initBG() {
  const bg = new GameObject('bg', {
    size: {
      width: 750,
      height: 1642
    }
  })
  bg.addComponent(new Img({
    resource: 'bg'
  }))
  game.scene.addChild(bg)
}

interface Position {
  x: number,
  y: number
}

// 添加篮球 及其 投篮的过渡动画
function initBasketBall(position: Position, targetPosition: Position) {
  const basketball = new GameObject('basketball', {
      size: { width: 79, height: 79 },
      origin: { x: 0.5, y: 0.5 },
      position,
      anchor: {
        x: 0,
        y: 0,
      },
  });
  basketball.addComponent(
      new Img({
        resource: 'basketball',
      })
  );
  const animation = basketball.addComponent(new Transition());
  animation.group = {
    idle: [
      {
        name: 'scale.x',
        component: basketball.transform,
        values: [
          {
            time: 0,
            value: 1,
            tween: 'ease-out',
          },
          {
            time: 300,
            value: 1.2,
            tween: 'ease-in',
          },
          {
            time: 600,
            value: 1,
          },
        ],
      },
      {
        name: 'scale.y',
        component: basketball.transform,
        values: [
          {
            time: 0,
            value: 1,
            tween: 'ease-out',
          },
          {
            time: 300,
            value: 1.2,
            tween: 'ease-in',
          },
          {
            time: 600,
            value: 1,
          },
        ],
      },
    ],
    move: [
      {
        name: 'position.x',
        component: basketball.transform,
        values: [
          {
            time: 0,
            value: position.x,
            tween: 'ease-in',
          },
          {
            time: 300,
            value: targetPosition.x,
            tween: 'ease-out',
          },
        ],
      },
      {
        name: 'position.y',
        component: basketball.transform,
        values: [
          {
            time: 0,
            value: position.y,
            tween: 'ease-out',
          },
          {
            time: 300,
            value: targetPosition.y,
          },
        ],
      },
    ],
    fall: [
      {
        name: 'position.x',
        component: basketball.transform,
        values: [
          {
            time: 0,
            value: targetPosition.x,
            tween: 'ease-in',
          },
          {
            time: 300,
            value: targetPosition.x+1,
            tween: 'ease-out',
          },
        ],
      },
      {
        name: 'position.y',
        component: basketball.transform,
        values: [
          {
            time: 0,
            value: targetPosition.y,
            tween: 'ease-in',
          },
          {
            time: 1200,
            value: position.y,
            tween: 'ease-in',
          },
        ],
      },
    ],
    reset: [
      {
        name: 'position.x',
        component: basketball.transform,
        values: [
          {
            time: 0,
            value: targetPosition.x,
            tween: 'ease-in',
          },
          {
            time: 300,
            value: position.x,
            tween: 'ease-out',
          },
        ],
      },
      {
        name: 'position.y',
        component: basketball.transform,
        values: [
          {
            time: 0,
            value: position.y,
            tween: 'ease-out',
          },
          {
            time: 300,
            value: position.y+1,
          },
        ],
      },
    ]
  };
  game.scene.addChild(basketball)

  return {basketball, animation};
}

// 添加篮板
function initBackboard() {
  const backboard = new GameObject('backboard', {
    size: {
      width: 166,
      height: 157,
    },
    position: {
      x: 0,
      y: 380,
    },
    anchor: {
      x: 0,
      y: 0,
    },      
  });
  backboard.addComponent(
      new Img({
        resource: 'backboard',
      })
  );
  game.scene.addChild(backboard)
}

// 添加篮网上半部分
function initBasketBack() {
  const basketBack = new GameObject('basketBack', {
    size: {
      width: 166,
      height: 158,
    },
    position: {
      x: 107,
      y: 450,
    },
    anchor: {
      x: 0,
      y: 0,
    },  
  });

  basketBack.addComponent(
    new Img({
      resource: 'basketBack',
    })
  );
  game.scene.addChild(basketBack)
}

// 添加篮网 及其 投篮时对应的帧动画
function initBasketFront(position: Position) {
  const basetFront = new GameObject('board', {
    size: {
      width: 166,
      height: 157,
    },
    position,
    // position: {
    //   x: 80,
    //   y: -760,
    // },
    // anchor: {
    //   x: 0,
    //   y: 1,
    // },
  });

  const anim = basetFront.addComponent(
    new SpriteAnimation({
      resource: 'boardIdle',
      speed: 100,
    })
  );

  const playAnim = (status: number) => {
    switch(status) {
      case 0: {
        anim.resource = 'boardIdle';
        break;
      }
      case 1: {
        anim.resource = 'boardGoal';
        setTimeout(() => {
          anim.resource = 'boardIdle';
        }, 900);
        break;
      }
      default:
        anim.resource = 'boardIdle';
        break;
    }
  };

  game.scene.addChild(basetFront);
  
  window.playAnim = playAnim;

  return { basetFront, playAnim };
}

function initAllResource() {
  const position: Position = { x: 500, y: 1100 }; // 篮球初始位置
  const pos: Position = {x: 120,y: 450 }; // 篮筐位置
   

  initBG(); // 背景
  const {basetFront, playAnim } = initBasketFront(pos);  // 篮筐(篮网下部分) 及其动画
  pos.x += basetFront.transform.size.width / 2; // 投篮时篮球目标位置
  const { animation } = initBasketBall(position, pos); // 篮球 及其 投篮的过渡动画
  initBackboard(); // 篮板
  initBasketBack(); // 篮网上半部分


  const btn = createBtn({
  text: '投球',
  transform: {
    position: {
      x: 0,
      y: -400,
    },
    origin: {
      x: 0.5,
      y: 0.5,
    },
    anchor: {
      x: 0.5,
      y: 1,
    },
  },
  callback: () => {
    animation.play('idle', 2);
    let status = 0;
    animation.on('finish', name => {
      // console.log(name);
      if (status ===0 && name === 'idle') {
        animation.play('move', 1);  // 投球
        status = 1;
      } else if(status ===1 && name === 'move') {
        playAnim(1); // 篮筐动画
        animation.play('fall', 1); // 球落下
        status = 2;
      } else if (status ===2 && name === 'fall') {
       animation.play('reset', 1);
       animation.play('idle', 2);
      }
    });
  },
});
  game.scene.addChild(btn);
}

initAllResource();

