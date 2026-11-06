# futex / thread-churn stress for Meta Ray-Ban Display (greatwhite)

A Web App that hammers `futex(FUTEX_WAIT)` via `Atomics.wait` while churning worker threads and memory.
The glasses run Linux 5.10.240, which is missing the futex fixes that landed in 5.10.261-273
(CVE-2026-74658, CVE-2026-99169 and friends); worker churn also exercises the binder teardown races
(CVE-2026-64468/64469 are kernel-side but share the same process-teardown shape).

The page counts sessions in `localStorage`: if the glasses reboot, the counter goes up on next launch and
"last session" shows how long it survived.

`sw.js` is the cross-origin-isolation shim: GitHub Pages cannot send COOP/COEP, and without them
`SharedArrayBuffer` (and therefore `Atomics.wait`) does not exist.
