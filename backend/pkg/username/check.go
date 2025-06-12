package username

import (
	"net/http"
)

type CheckResult struct {
	Platform string `json:"platform"`
	URL      string `json:"url"`
	Status   string `json:"status"`
	Code     int    `json:"code"`
}

var platforms = map[string]string{
	"Instagram": "https://www.instagram.com/",
	"X":         "https://twitter.com/",
	"Facebook":  "https://www.facebook.com/",
	"YouTube":   "https://www.youtube.com/user/",
	"Reddit":    "https://www.reddit.com/user/",
	"GitHub":    "https://www.github.com/",
	"Twitch":    "https://www.twitch.tv/",
	"Pinterest": "https://www.pinterest.com/",
	"TikTok":    "https://www.tiktok.com/@",
	"Flickr":    "https://www.flickr.com/photos/",
}

func CheckAllPlatforms(user string) []CheckResult {
	results := []CheckResult{}

	for platform, baseURL := range platforms {
		url := baseURL + user

		resp, err := http.Get(url)
		status := "unknown"
		code := 0

		if err == nil {
			defer resp.Body.Close()
			code = resp.StatusCode

			switch code {
			// case 200:
			// 	status = "unavailable"
			case 404:
				status = "available"
			default:
				status = "unavailable"
			}
		}

		results = append(results, CheckResult{
			Platform: platform,
			URL:      url,
			Status:   status,
			Code:     code,
		})
	}

	return results
}
