#!/usr/bin/python

import sys
import string

def main():
    
    #Convert git log input to usable data structure
    #Go line by line, filter for the "Date: …" lines
    #Then filter for the <timezone> in the Date line
    #Count how many times each timezone appears
    #Sort and print the results
    
    
    # strip off the newline characters on the right
    
    input = []
    for line in sys.stdin:
        input.append(line.rstrip())

    timeZoneCount = []

    for info in input:
        if ('Date:' in info):
            holder = info.split()
            inTimeZoneCount = False
            for timeZone in timeZoneCount:
                #print(timeZone)
                #print(holder)
                if( timeZone[0] == holder[6]):
                    timeZone[1] = timeZone[1] + 1
                    inTimeZoneCount = True
                    break
            if(inTimeZoneCount == False):
                timeZoneCount.append([holder[6], 1])

                
    #------------------------------------------------------------------------------------------------

    timeZoneCount.sort()

    #stdout
    print(timeZoneCount)


if __name__ == "__main__":
    main()



