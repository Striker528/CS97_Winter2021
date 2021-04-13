#include "options.h"

#include <cpuid.h>
#include <errno.h>
#include <immintrin.h>
#include <limits.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include <string.h>

#include<unistd.h>



int checkArgs(int argc, char **argv, struct format * userFormat){

  //char testString []= "Entering checkArgs";
  //printf("%s", testString);

  userFormat->howManyBytesAtATime = -1;
  userFormat->input = "/dev/random";
  userFormat->nbytes = 0;

  int c = 0;

    while ((c = getopt(argc, argv, "i:o:")) != -1) {

      /*extern char *optarg = c;*/

        switch(c) {
        case 'i': {

          if(optarg[0] == '/'){
            userFormat->input = optarg; 
            break;
          }
          else if (strcmp(optarg, "mrand48_r") == 0){
            userFormat->input = "mrand48_r";
            break;
          }
          else{
            userFormat->input = "hardware_rand64_init";
            break;
          }

          break;
        }

        case 'o': {
          //char testString1 []= "Entering the o part";
          //printf("%s", testString1);


          if (strcmp(optarg, "stdio") == 0){
            break;
          }
          else{
            /* Do N, Output N bytes at a time, using the write system call*/
            if(  (long long int)optarg > 0){
              (*userFormat).howManyBytesAtATime = (long long)optarg;
            }
          }

          break;
        }
        }
    }
    
    /* optind == argc*/
    /* N bytes == optind */
    /* printf*/
    /* getchar */
    char *endptr;
    (*userFormat).nbytes = strtoll(argv[optind], &endptr, 10); 

    if(userFormat->nbytes < 0){
      return 1;
    }
    return 0;
}