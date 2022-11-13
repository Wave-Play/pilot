import { Pilot } from '@waveplay/pilot';
import { createHandler } from '@waveplay/pilot/api';

export default createHandler({ pilot: new Pilot({ logger: console }) });
