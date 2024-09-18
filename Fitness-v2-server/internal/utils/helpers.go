package utils

import "log"

func FmtLogError(file, funcName string, err error) {
	log.Printf("[ERROR] %s: %s - %s\n", file, funcName, err)
}

func FmtLogInfo(file, funcName string, msg string) {
	log.Printf("[INFO] %s: %s - %s\n", file, funcName, msg)
}
