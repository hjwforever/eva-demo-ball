import resources from './resources';

import { Game, GameObject, resource, LOAD_EVENT } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { Img, ImgSystem } from '@eva/plugin-renderer-img';
import { EventSystem } from '@eva/plugin-renderer-event';
import { SpriteAnimationSystem, SpriteAnimation } from '@eva/plugin-renderer-sprite-animation';
import { RenderSystem } from '@eva/plugin-renderer-render';
import { TransitionSystem } from '@eva/plugin-transition';
import { GraphicsSystem } from '@eva/plugin-renderer-graphics';
import { TextSystem } from '@eva/plugin-renderer-text';


declare global {
  interface Window {
    playAnim: any;
  }
}


resource.addResource(resources);

// 资源预加载
resource.preload();
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

// 添加篮球
function initBasketBall() {
  const basketball = new GameObject('basketball', {
      size: { width: 79, height: 79 },
      origin: { x: 0.5, y: 0.5 },
      position: { x: 500, y: 1100 },
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
  game.scene.addChild(basketball)
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

// 添加篮网
function initBasketFront() {
  const basetFront = new GameObject('board', {
    size: {
      width: 166,
      height: 157,
    },
    position: {
      x: 120,
      y: 450,
    },
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

  const playAnim = () => {
    anim.resource = 'boardGoal';
    setTimeout(() => {
      anim.resource = 'boardIdle';
    }, 900);
  };

  game.scene.addChild(basetFront);
  
  window.playAnim = playAnim;
}

function initAllResource() {
  initBG();
  initBasketBall();
  initBackboard();
  initBasketBack();
  initBasketFront();
}

initAllResource();

