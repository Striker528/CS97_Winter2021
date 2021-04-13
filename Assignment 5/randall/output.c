#include "output.h"
#include "rand64-sw.h"
#include "rand64-hw.h"
#include "options.h"

#include "mrand48r.h"

#include <cpuid.h>
#include <errno.h>
#include <immintrin.h>
#include <limits.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include<string.h>

//for write
#include<unistd.h>

int dealsWithOutput(struct format * userFormat){

  /* Now that we know we have work to do, arrange to use the
     appropriate library.  */

  //char testString2 []= "Entering dealsWithOutput";
  //printf("%s", testString2);

  
  void (*initialize) (void);
  unsigned long long (*rand64) (void);
  void (*finalize) (void);

  if (strcmp( userFormat->input, "rdrand")) {
      initialize = hardware_rand64_init;
      rand64 = hardware_rand64;
      finalize = hardware_rand64_fini;
    }

  else if (userFormat->input[0] == '/') {
      setUserFile(userFormat->input);
      initialize = software_rand64_init;
      rand64 = software_rand64;
      finalize = software_rand64_fini;
    }

    else{
      initialize = mrand48r_init;
      rand64 = mrand48r_main;
      finalize = mrand48r_fini;
    }

  initialize ();
  int wordsize = sizeof rand64 ();
  int output_errno = 0;
  errno = 0; 


  if (userFormat->howManyBytesAtATime > 0){ 

    //printf("%s", "Entering the different byte Output");

    /*
    char x[format.howManyBytesAtATime];

    do {
      unsigned long long x = rand64 ();
      int outbytes = *format.nbytes < wordsize ? *format.nbytes : wordsize;

      // number of bits I want to copy, bits = 8, bytes = 64
      memcpy(x, rand64, 64);
      //Copies the values of num bytes (arg 3) from the location pointed to by source (arge 2)
      //directly to the memory block pointed to by destination. (arg 1)
  
      *format.nbytes -= outbytes;
    } while (0 < *format.nbytes);
  // Outerloop: batch size at a time
  */



    ///*
    //Pseudo Code Daniel's Slides:
    //Example usage is ./randall -o 15 50
    //Implies Write 50 bytes in total, in blocks of 15 at a time
    //If -o option is not stdio ^: if (format->howManyBytesAtATime > 0) 
  
    int totalWritten = 0;
    int requiredToWrite = userFormat->nbytes; 
    int bufferSize = userFormat->howManyBytesAtATime; 
    
    //Malloc a buffer (char array) big enough to hold bufferSize chars
    //char buffer[bufferSize];
    char *buffer = malloc (bufferSize * sizeof(long long int));
    
    //Generate random numbers and print them
    while (totalWritten < requiredToWrite){ 
      unsigned long long x = rand64 ();
      int currentArrayIndex = 0;

      //check if last write needs to be smaller than normal to not go over requiredToWrite
      if (totalWritten + bufferSize > requiredToWrite){
        bufferSize = requiredToWrite - totalWritten; 
        }

      //Put random chars in buffer
      while (x > 0 && currentArrayIndex < bufferSize){
        //put x in buffer at current array index and increment
        buffer[currentArrayIndex] = x & 0xFF; 
        currentArrayIndex++;
        //bitshift x
        x >>= 8; 
        }
      
      //Print the buffer, keep track of how many were written
      if (currentArrayIndex == bufferSize){
        //bytesWritten = write N bytes from buffer to stdout (10 bytes written)
        //stdout == 1
        long long int bytesWritten = write(1, buffer, bufferSize * sizeof(char));
        totalWritten += bytesWritten;
        }
    }
    //need this to free up the memory from melloc
    free(buffer);
    //*/

  //return 1
  exit(1);
  }

  else{
    do
    {
      unsigned long long x = rand64 ();
      int outbytes = userFormat->nbytes < wordsize ? userFormat->nbytes : wordsize;
      if (!writebytes (x, outbytes)) {
	      output_errno = errno;
	      break;
	    }
      userFormat->nbytes -= outbytes;
    }
  while (0 < userFormat->nbytes);

  if (fclose (stdout) != 0)
    output_errno = errno;

  if (output_errno)
    {
      errno = output_errno;
      perror ("output");
    }

  finalize ();
  //return !!output_errno;
  exit(!!output_errno);

  }

}