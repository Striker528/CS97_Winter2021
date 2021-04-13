#include "mrand48r.h"

#include <cpuid.h>
#include <errno.h>
#include <immintrin.h>
#include <limits.h>
#include <stdbool.h>
#include <stdio.h>

/* has mrand48_r*/
#include <stdlib.h>

//has time
#include <time.h>

struct drand48_data bufferData = {0};

//get undefined reference to these functions if I do not add them to the make file

/* Initialize the mrand48_r implementation.  */
void mrand48r_init (void){
    int seedVal = time(NULL); 
    srand48_r(seedVal, &bufferData);
}

/* Return a random value, using mrand48_r.  */
unsigned long long mrand48r_main (void){

    /* it uses the random number generator described by the value in the buffer pointed to by buffer. */

    long int result = 0;
    long int *ptrToResult = &result; 
    mrand48_r(&bufferData, ptrToResult);
    result = *ptrToResult; 

    return (long long int)result;
}

/* Finalize the software rand64 implementation.  */
void mrand48r_fini (void){
}