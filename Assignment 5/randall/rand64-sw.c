#include "rand64-sw.h"

#include <cpuid.h>
#include <errno.h>
#include <immintrin.h>
#include <limits.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

/* Software implementation.  */

/* Input stream containing random bytes.  */
static FILE *urandstream;

char *fileName; 

/* Initialize the software rand64 implementation.  */
void software_rand64_init (void) {
  urandstream = fopen (fileName, "r");
  if (! urandstream)
    abort ();
}

/* Return a random value, using software operations.  */
unsigned long long software_rand64 (void) {
  unsigned long long int x;
  if (fread (&x, sizeof x, 1, urandstream) != 1)
    abort ();
  return x;
}

/* Finalize the software rand64 implementation.  */
void software_rand64_fini (void) {
  fclose (urandstream);
}

void setUserFile( char *inputFile){
  fileName = inputFile;
}

_Bool writebytes (unsigned long long x, int nbytes) {
  do
    {
      if (putchar (x) < 0)
	return false;
      x >>= CHAR_BIT;
      nbytes--;
    }
  while (0 < nbytes);

  return true;
}