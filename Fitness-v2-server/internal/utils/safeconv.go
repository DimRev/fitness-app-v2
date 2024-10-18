package utils

import (
	"fmt"
	"math"
	"strconv"
)

type OutOfRangeError struct {
	Value     string
	Min       int64
	Max       int64
	RangeType string
}

type SyntaxError struct {
	Value string
}

func (e *OutOfRangeError) Error() string {
	return fmt.Errorf("value %s is out of range [%d, %d] for %s", e.Value, e.Min, e.Max, e.RangeType).Error()
}

func (e *SyntaxError) Error() string {
	return fmt.Errorf("invalid syntax: %s", e.Value).Error()
}

func SafeParseStrToInt32(s string, min int64, max int64) (int32, error) {
	i, err := strconv.ParseInt(s, 10, 32)
	if err != nil {
		switch e := err.(type) {
		case *strconv.NumError:
			if e.Err == strconv.ErrRange {
				return 0, &OutOfRangeError{
					Value:     s,
					Min:       min,
					Max:       max,
					RangeType: "int32",
				}
			} else if e.Err == strconv.ErrSyntax {
				return 0, &SyntaxError{
					Value: s,
				}
			} else {
				return 0, err
			}
		default:
			return 0, err
		}
	}
	if i < min || i > max {
		return 0, &OutOfRangeError{}
	}

	return int32(i), nil
}

func SafeParseIntToInt32(n int, min int, max int) (int32, error) {
	if n < min || n > max || n < math.MinInt32 || n > math.MaxInt32 {
		return 0, &OutOfRangeError{
			Value:     fmt.Sprintf("%d", n),
			Min:       int64(min),
			Max:       int64(max),
			RangeType: "int32",
		}
	}
	return int32(n), nil
}

func SafeParseInt64ToInt32(n int64, min int64, max int64) (int32, error) {
	if n < min || n > max || n < math.MinInt32 || n > math.MaxInt32 {
		return 0, &OutOfRangeError{
			Value:     fmt.Sprintf("%d", n),
			Min:       int64(min),
			Max:       int64(max),
			RangeType: "int32",
		}
	}
	return int32(n), nil
}
