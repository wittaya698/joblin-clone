package main

import (
	//"bufio"
	//"errors"
	"fmt"
	"io"
	"os"

	// "os/exec"
	// "os/user"
	"path"
	"path/filepath"

	// "runtime"
	// "strconv"
	"strings"
	// "time"
	"net/http"
	"net/url"

	"github.com/jessevdk/go-flags"
)

const VERSION = "1.0.0"

type SyncCommandOptions struct {
	// FfmpegPath        string `long:"ffmpeg" description:"Path to ffmpeg." default:"ffmpeg"`
	// FrameDirPath      string `short:"d" long:"frame-dir" description:"Path to directory that will contain the captured frames. (default: <PictureDirectory>/pmcctv)"`
	// RemoteDir         string `short:"r" long:"remote-dir" description:"Remote location where frames will be saved to. Must contain a path compatible with scp (eg. user@someip:~/pmcctv)."`
	// RemotePort        string `short:"p" long:"remote-port" description:"Port of remote location where frames will be saved to. If not set, whatever is the default scp port will be used (should be 22)."`
	// BurstModeDuration int    `short:"b" long:"burst-mode-duration" description:"Duration of burst mode, in seconds. Set to 0 to disable burst mode altogether." default:"10"`
	// BurstModeFormat   string `short:"f" long:"burst-mode-format" description:"Format of burst mode captured files, either \"image\" or \"video\"." default:"video"`
	// FramesTtl         int    `short:"t" long:"time-to-live" description:"For how long captured frames should be kept, in days." default:"7"`
	// InputDevice       string `short:"i" long:"input-device" description:"Name of capture input device. (default: auto-detect)"`
}

type AppCommandOptions struct {
	Version bool `long:"version" description:"Display version information"`
}

type CommandOptions struct {
	App  AppCommandOptions
	Sync SyncCommandOptions
}

func printHelp(flagParser *flags.Parser) {
	flagParser.WriteHelp(os.Stdout)
	fmt.Printf("\n")
	fmt.Printf("For help with a particular command, type \"%s <command> --help\"\n", path.Base(os.Args[0]))
}

func createFlagParser() (CommandOptions, *flags.Parser) {
	var opts CommandOptions
	flagParser := flags.NewParser(&opts.App, flags.HelpFlag|flags.PassDoubleDash)

	flagParser.AddCommand(
		"sync",
		"Synchronize notes",
		"Synchronize local notes with the server.",
		&opts.Sync,
	)

	return opts, flagParser
}

func createId(path string) string {
	fmt.Println("createId(): to be implemented")
	os.Exit(1)
	return ""
}

func readFile(path string) (string, error) {
	fmt.Println("readFile(): to be implemented")
	os.Exit(1)
	return "", nil
}

func makeApiCall(method string, path string, data url.Values) (error, []byte) {
	baseUrl := "http://127.0.0.1:8000"
	fullUrl := baseUrl + "/" + path

	client := http.Client{}
	request, err := http.NewRequest(method, fullUrl, strings.NewReader(data.Encode()))
	if err != nil {
		return err, []byte{}
	}

	request.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response, err := client.Do(request)
	body, err := io.ReadAll(response.Body)
	if err != nil {
		return err, []byte{}
	}

	return nil, body
}

// type Note struct {
//     Id string
//     Title string
//     Body string
// }

func main() {
	var err error

	//err, body := makeApiCall("GET", "users/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", url.Values{})

	note := url.Values{}
	note.Add("title", "from go")
	note.Add("body", "body from go")

	err, body := makeApiCall("POST", "notes", note)
	fmt.Println(err)
	fmt.Println(string(body))
	// os.Exit(0)

	opts, flagParser := createFlagParser()

	args, err := flagParser.Parse()

	if err != nil {
		t := err.(*flags.Error).Type
		if t == flags.ErrHelp {
			printHelp(flagParser)
			os.Exit(0)
		} else if t == flags.ErrCommandRequired {
			// Here handle default flags (which are not associated with any command)
			if opts.App.Version {
				fmt.Println(VERSION)
				os.Exit(0)
			}
			printHelp(flagParser)
			os.Exit(0)
		} else {
			fmt.Printf("Error: %s\n", err)
			fmt.Printf("Type '%s --help' for more information.\n", path.Base(os.Args[0]))
			os.Exit(1)
		}
	}

	_ = args

	fullPath := "/Users/macbookair/Workspace/witthaya's projects/JoblinClone/cli-client/test"

	walkPath := func(path string, info os.FileInfo, err error) error {
		if len(path)-len(fullPath) <= 0 {
			return nil
		}
		fmt.Println("FullPath > path")
		os.Exit(1)
		return nil
	}

	filepath.Walk(fullPath, walkPath)
}
