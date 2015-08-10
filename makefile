# Create the list of files
files = src/*.js\

.DEFAULT_GOAL := all

all: ${files}
				@echo "Generating aggregated webform.js file"
				@cat > webform.js $^
				@echo "done."
