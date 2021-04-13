#ifndef __MRAND48__
#define __MRAND48__

//struct drand48_data{}

/* Initialize the software rand64 implementation.  */
void mrand48r_init (void);

/* Return a random value, using software operations.  */
unsigned long long mrand48r_main (void);

/* Finalize the software rand64 implementation.  */
void mrand48r_fini (void);

#endif