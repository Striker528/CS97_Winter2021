/* Generate N bytes of random output.  */

/* When generating output this program uses the x86-64 RDRAND
   instruction if available to generate random numbers, falling back
   on /dev/random and stdio otherwise.

   This program is not portable.  Compile it with gcc -mrdrnd for a
   x86-64 machine.

   Copyright 2015, 2017, 2020 Paul Eggert

   This program is free software: you can redistribute it and/or
   modify it under the terms of the GNU General Public License as
   published by the Free Software Foundation, either version 3 of the
   License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful, but
   WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
   General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.  */

#include <cpuid.h>
#include <errno.h>
#include <immintrin.h>
#include <limits.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>


#include "options.h"
#include "output.h"
#include "rand64-hw.h"
#include "rand64-sw.h"
#include "mrand48r.h"

/*Get Opt*/
#include <unistd.h>

/* Struct strings*/
#include <string.h>


/* Main program, which outputs N bytes of random data.  */
int main (int argc, char **argv) {
  /*argc: specifies the # of shell arguments passed in
    argv: array of C strings containing the shell arguments */

    // %d is being used to print an integer, 
    // %s is being usedto print a string, 
    // %f is being used to print a float and 
    // %c is being used to print a character.
    //char testString []= "Entering main";
    //printf("%s", testString);

  struct format userInput = {0};

  int isArgsGood = checkArgs(argc, argv, &userInput); 

  if (isArgsGood == 1){
    exit(1);
  }

  return (dealsWithOutput(&userInput));
}
