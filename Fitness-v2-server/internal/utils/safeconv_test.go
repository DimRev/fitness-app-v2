package utils

import (
	"fmt"
	"math"
	"testing"
)

func TestSafeParseStrToInt32(t *testing.T) {
	tests := []struct {
		name        string
		s           string
		min         int64
		max         int64
		expected    int32
		expectedErr error
	}{
		{
			name:        "valid input",
			s:           "123",
			min:         0,
			max:         math.MaxInt32,
			expected:    123,
			expectedErr: nil,
		},
		{
			name:     "invalid input",
			s:        "abc",
			min:      0,
			max:      math.MaxInt32,
			expected: 0,
			expectedErr: &SyntaxError{
				Value: "abc",
			},
		},
		{
			name:     "out of range",
			s:        "2147483649",
			min:      0,
			max:      math.MaxInt32,
			expected: 1000,
			expectedErr: &OutOfRangeError{
				Value:     "2147483649",
				Min:       0,
				Max:       math.MaxInt32,
				RangeType: "int32",
			},
		},
	}

	for i, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			actual, err := SafeParseStrToInt32(tc.s, tc.min, tc.max)
			if err != nil {
				if tc.expectedErr != nil {
					expectedErrStr := tc.expectedErr.Error()
					actualErrStr := err.Error()
					if expectedErrStr != actualErrStr {
						t.Errorf("Test %v - FAILED  |\n Unexpected error parsing string to int32 - expected: %v, actual: %v\n", i, expectedErrStr, actualErrStr)
					}
					return
				}
			}
			fmt.Println(actual)
			if actual != tc.expected {
				t.Errorf("Test %v - FAILED  |\n Unexpected int32 value - expected: %v, actual: %v\n", i, tc.expected, actual)
			}
		})
	}
}

func TestSafeParseIntToInt32(t *testing.T) {
	tests := []struct {
		name        string
		n           int
		min         int
		max         int
		expected    int32
		expectedErr error
	}{
		{
			name:        "valid input",
			n:           123,
			min:         0,
			max:         math.MaxInt32,
			expected:    123,
			expectedErr: nil,
		},
		{
			name:     "invalid input",
			n:        math.MaxInt32 + 1,
			min:      0,
			max:      math.MaxInt32,
			expected: 0,
			expectedErr: &OutOfRangeError{
				Value:     "2147483648",
				Min:       0,
				Max:       math.MaxInt32,
				RangeType: "int32",
			},
		},
		{
			name:     "out of range",
			n:        -1,
			min:      0,
			max:      math.MaxInt32,
			expected: 0,
			expectedErr: &OutOfRangeError{
				Value:     "-1",
				Min:       0,
				Max:       math.MaxInt32,
				RangeType: "int32",
			},
		},
	}

	for i, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			actual, err := SafeParseIntToInt32(tc.n, tc.min, tc.max)
			if err != nil {
				if tc.expectedErr != nil {
					expectedErrStr := tc.expectedErr.Error()
					actualErrStr := err.Error()
					if expectedErrStr != actualErrStr {
						t.Errorf("Test %v - FAILED  |\n Unexpected error parsing int to int32 - expected: %v, actual: %v\n", i, expectedErrStr, actualErrStr)
					}
					return
				}
			}
			if actual != tc.expected {
				t.Errorf("Test %v - FAILED  |\n Unexpected int32 value - expected: %v, actual: %v\n", i, tc.expected, actual)
			}
		})
	}
}
