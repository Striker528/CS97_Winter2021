#ifndef __rand64_sw__
#define __rand64_sw__

#include "options.h"

/* Initialize the software rand64 implementation.  */
void software_rand64_init (void);

/* Return a random value, using software operations.  */
unsigned long long software_rand64 (void);

/* Finalize the software rand64 implementation.  */
void software_rand64_fini (void);

void setUserFile(char inputFile[]);

_Bool writebytes (unsigned long long x, int nbytes);

#endif