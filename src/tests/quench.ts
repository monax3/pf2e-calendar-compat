import type { Quench } from '@ethaks/fvtt-quench';

import AR from './absalom-reckoning';
import GC from './gregorian-calendar';

if (process.env['NODE_ENV'] !== 'production') {
    Hooks.on('quenchReady', (quench: Quench) => {
        quench.registerBatch('pf2e-calendar-compat.gregorian-calendar', GC);
        quench.registerBatch('pf2e-calendar-compat.absalom-reckoning', AR);
    });
}
