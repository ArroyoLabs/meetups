package main
 
import (
	"fmt"
	"net/http"
	"runtime"
)
 
func indexHandler( w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "hello world, I'm running on %s with an %s CPU \nUbuntu Go container w/ glide", runtime.GOOS, runtime.GOARCH)
}

func main() {
	http.HandleFunc("/", indexHandler)
	http.ListenAndServe(":8888",nil)
}
