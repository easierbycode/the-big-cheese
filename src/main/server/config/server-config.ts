import { CommonServerConfig } from './common-server-config';

export class ServerConfig extends CommonServerConfig {
   static readonly MOON_RADIUS: number = 400 * ServerConfig.MAP_OUTPUT_SCALE;
   static readonly MAX_NR_OF_PLAYERS: number = 20;
}
