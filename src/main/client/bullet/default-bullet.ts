// Documentation: https://phaser.io/examples/v3/view/physics/arcade/bullets-group
import * as Phaser from 'phaser';
import { SharedConfig } from '../../shared/config/shared-config';
import { Keys } from '../config/constants';
import { MathUtil } from '../util/math-util';

export interface BulletFireOptions {
   readonly position: Phaser.Math.Vector2;
   readonly direction: Phaser.Math.Vector2;
}

const DEFAULT_BULLET_SPEED = 0.85; // It needs to be synced with the server

class DefaultBullet extends Phaser.Physics.Arcade.Sprite {
   private timeAlive = 0;
   private readonly lifeTime = 1000;

   constructor(scene: Phaser.Scene, x: number, y: number) {
      super(scene, x, y, Keys.BULLET);
   }

   fire(options: BulletFireOptions): void {
      this.body.reset(options.position.x, options.position.y);

      this.setActive(true);
      this.setVisible(true);

      options.direction.scale(DEFAULT_BULLET_SPEED * SharedConfig.BULLET_BASE_SPEED);

      this.setVelocityY(options.direction.y);
      this.setVelocityX(options.direction.x);

      this.timeAlive = 0;
   }

   preUpdate(time: number, delta: number): void {
      super.preUpdate(time, delta);

      if (this.timeAlive > this.lifeTime) {
         this.setActive(false);
         this.setVisible(false);
      } else {
         this.timeAlive += delta;
      }
   }
}

export class Bullets extends Phaser.Physics.Arcade.Group {
   private bulletSounds: Phaser.Sound.BaseSound[];
   private cache: { [key: string]: DefaultBullet } = {};

   constructor(scene: Phaser.Scene) {
      super(scene.physics.world, scene);

      this.createMultiple({
         frameQuantity: 100,
         key: Keys.BULLET,
         active: false,
         visible: false,
         classType: DefaultBullet,
      });

      this.bulletSounds = [
         scene.sound.add(Keys.BASIC_GUN_SOUND, {
            volume: 0.3,
         }),
         scene.sound.add(Keys.BASIC_GUN_SOUND, {
            volume: 0.3,
            detune: -100,
         }),
         scene.sound.add(Keys.BASIC_GUN_SOUND, {
            volume: 0.3,
            detune: -50,
         }),
         scene.sound.add(Keys.BASIC_GUN_SOUND, {
            volume: 0.3,
            detune: 50,
         }),
         scene.sound.add(Keys.BASIC_GUN_SOUND, {
            volume: 0.3,
            detune: 100,
         }),
      ];
   }

   fireBullet(id: string, options: BulletFireOptions): void {
      const bullet = this.getFirstDead(false);

      if (bullet) {
         this.cache[id] = bullet;
         bullet.fire(options);
         this.bulletSounds[MathUtil.randomIntFromInterval(0, this.bulletSounds.length - 1)].play();
      }
   }

   killBullet(id: string): void {
      const bullet = this.cache[id];
      if (bullet) {
         bullet.setActive(false);
         bullet.setVisible(false);
         this.cache[id] = undefined;
      }
   }
}
