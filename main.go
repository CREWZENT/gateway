package main

import (
	"github.com/labstack/echo"
)

func main() {
	e := echo.New()
	e.Static("/static", "./product/static")
	e.GET("*", func(c echo.Context) error {
		return c.File("./product/index.html")
	})
	e.Start(":80")
}
