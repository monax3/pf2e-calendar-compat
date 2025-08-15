import type { Quench, QuenchRegisterBatchFunction } from 'pf2e-types/quench';

import AR from './absalom-reckoning';
import GC from './gregorian-calendar';

if (process.env.NODE_ENV !== 'production') {
    Hooks.on('quenchReady', (quench: Quench) => {
        quench.registerBatch('pf2e-calendar-compat.gregorian-calendar', GC as unknown as QuenchRegisterBatchFunction);
        quench.registerBatch('pf2e-calendar-compat.absalom-reckoning', AR as unknown as QuenchRegisterBatchFunction);
    });
}
