#!/usr/bin/python

import random
import argparse
import sys
import string

#the starting point for the shuffle
"""
def shuffle_and_output_lines(lines):
    random.shuffle(lines)
    for line in lines:
        print(line)
"""

def main():

    parser = argparse.ArgumentParser(description = 'test')

    parser.add_argument('infile', nargs = '?', type=argparse.FileType('r') )#, default = sys.stdin)
    #Use nargs = '*' for geting 0+ aguments which we are told to account for
    parser.add_argument("-e", "--echo", nargs = '*', help = "treat each ARG as an input line")
    parser.add_argument("-i", "--input-range", help = "treat each number LO through HI as an input line")
    parser.add_argument("-n", "--head-count", help = "output at most COUNT lines")
    parser.add_argument("-r", "--repeat", action = "store_true", help = "output lines can be repeated")


    args = parser.parse_args()
    #for testing that I have all the arguments
    # print([(args.echo),(args.input_range), (args.head_count), (args.repeat), (args.infile)])
    
    #store arguments to be shuffles in 'lines' list
    lines = []
    numlines = 0

    #-------------------------------------------------------------------------------------

    #can't have -e and -l
    #from https://github.com/coreutils/coreutils/blob/master/src/shuf.c
    if (args.echo and args.input_range):
        parser.error("cannot combine -e and -i options")

    #--------------------------------------------------------------------------------------
    #read file if specified

    #"""
    if(args.infile and args.infile != "-"):
        with open(args.infile.name) as f:
            lines = [line.rstrip() for line in f]
    #"""

    """
    if(args.infile and args.infile != "-"):
        f = open(args.infile, 'r')
        lines = f.readlines()
        lines = [line.strip() for line in lines]
    """

    #-------------------------------------------------------------------------------------------------

    # --echo
    if (args.echo != None):
        for index in range(len(args.echo)):
            lines.append(args.echo[index])
        #random.shuffle(lines)
        #for line in lines:
            #print(line)
        #return

    #------------------------------------------------------------------------------------------------

    # --input-range, two numbers, n(0+) - n+1(1+)
    if(args.input_range):
        txt = args.input_range
        txt = txt.split("-")
        low = txt[0] #the low number, before the -
        hi = txt[1] #the second number after the -, the high number

        #Checking if the LO and HI are valid
        if (len(txt) != 2):
            parser.error("Invalid input range 'Low-Hi': enter input range as: Low-Hi")
        if (not(low.isdigit() and hi.isdigit())):
            parser.error("Invalid input range 'Low-Hi': Low and Hi must be digits")
        if (low > hi):
            parser.error("Invalid input range 'Low-Hi': Low must be less than Hi")

        #filling in
        low = int(low)
        hi = int(hi)
        for index in range(low,hi,1):
            lines.append(index)

    #----------------------------------------------------------------------------------------

    # --head-count logic
    if(args.head_count):
        numlines = args.head_count

        #check N is valid, it needs to be 1 number.
        if(len(numlines) != 1):
            perser.error("Invalid head conut 'N': enter head count as : N")
        if (not(numlines.isdigit())):
            perser.error("Invalid head count 'N': N must be a digit")

        #N only affects shuf when it is less then num of arguments
        if(int(numlines) >= len(lines)):
            numlines = len(lines)
    else:
        numlines = len(lines)

    #-----------------------------------------------------------------------------------------

    # --repeat logic
    if(args.repeat):
        #if no other arguments, take from stdin
        if((len(lines) == 0) or (args.infile=="-")):
            for line in sys.stdin:
                line = line.strip()
                lines.append(line)
        if(args.head_count):
            numlines = int(args.head_count)
            for index in range(numlines):
                print(random.choice(lines))
        else:
            while(True):
                print(random.choice(lines))
        return

    #------------------------------------------------------------------------------------------------

    #read from stdin if no options or arguments or the only argument is "-"
    if ((len(lines) == 0) or (args.infile == "-")):
        if(args.echo != None):
            return
        for line in sys.stdin:
            line = line.strip()
            lines.append(line)
        numlines = len(lines)

    #------------------------------------------------------------------------------------------------

    #stdout
    random.shuffle(lines)
    #getting a wierd error where it said I converted the numlines to a string, so I just always convert it to an int
    numlines = (int(numlines))
    for index in range(numlines):
        print(lines[index])
        #print(lines)

    #another possible way for shuffling
    """
    with open(args.infile.name) as f:
        lines = [line.rstrip() for line in f]
    print(lines)
    shuffle_and_output_lines(lines)
    """

if __name__ == "__main__":
    main()

