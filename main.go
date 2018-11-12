package main

import (
	"github.com/labstack/echo"
	"golang.org/x/crypto/acme/autocert"
)

func main() {
	e := echo.New()

	e.AutoTLSManager.Cache = autocert.DirCache("/var/www/.cache")
	e.Static("/static", "./product/static")
	e.GET("*", func(c echo.Context) error {
		return c.File("./product/index.html")
	})
	e.StartAutoTLS(":443")
}
