package utils

import "log"

func FmtLogMsg(file, funcName string, err error) {
	log.Printf("%s: %s - %s\n", file, funcName, err)
}
