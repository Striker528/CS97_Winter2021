#ifndef __OPTIONS___
#define __OPTIONS___

struct format {

    //can't define the struct here, I will do it in the checkArgs
    long long howManyBytesAtATime; 
    char *input; 
    long long nbytes;
};



int checkArgs(int argc, char **argv, struct format * userFormat);

#endif