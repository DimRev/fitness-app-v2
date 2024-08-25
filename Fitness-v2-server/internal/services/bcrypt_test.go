package services

import "testing"

func TestHashAndCompere(t *testing.T) {
	tests := []struct {
		name        string
		pass        string
		comperePass string
		expectedErr error
	}{
		{name: "correct password", pass: "123123", comperePass: "123123", expectedErr: nil},
		{name: "incorrect password", pass: "123123", comperePass: "11", expectedErr: nil},
	}

	for i, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			hash, err := HashPassword(tc.pass)
			if err != nil {
				t.Errorf("Test %v - FAILED  |\n Error hashing password - %v\n", i, err)
				return
			}

			err = ComparePassword(tc.comperePass, hash)
			if err != nil {
				if tc.expectedErr != nil {
					expectedErrStr := tc.expectedErr.Error()
					actualErrStr := err.Error()
					if expectedErrStr != actualErrStr {
						t.Errorf("Test %v - FAILED  |\n Unexpected error comparing password - expected: %v, actual: %v\n", i, expectedErrStr, actualErrStr)
					}
					return
				}
			}
		})
	}
}
