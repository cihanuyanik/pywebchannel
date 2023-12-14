import os
import re
import sys
import shutil

# Load docs/index.rst
f = open('docs/index.rst', 'r', encoding="utf8")
indexLines = f.readlines()
f.close()

# find .. toctree:: elements
for lineIndex, line in enumerate(indexLines):
    if line.startswith(".. toctree::"):
        toctreeLineNumber = lineIndex
        break

contentElements = []
for lineIndex in range(lineIndex + 1, len(indexLines)):
    line = indexLines[lineIndex].strip()

    # stop at the next toctree
    if line.startswith(".."):
        break

    # skip comments
    if line.startswith(":"):
        continue

    # skip empty lines
    if line == "":
        continue

    # store the files to be copied
    contentElements.append(f"docs/{line}.md")

# Open README2.md file
fReadMe = open('README2.md', 'w', encoding="utf8")

# Load each file one by one
for i, contentItem in enumerate(contentElements):
    # try to open the file
    try:
        f = open(contentItem, 'r', encoding="utf8")
        contentLines = f.readlines()
        f.close()
    except:
        print(f"File {contentItem} not found")
        continue

    # First line has to be the title, Remove title symbol markdown
    title = contentLines[0].strip().replace("#", "").strip()
    # cover title with summary html tag
    title = "<summary><h1>" + title + "</h1></summary>\n"
    # update contentLines for new title
    contentLines[0] = title

    # cover content with details html tag
    contentLines.insert(0, f"<details{' open' if i == 0 else ''}>\n")
    contentLines.append("</details>")

    # write to README2.md
    fReadMe.writelines(contentLines)

# Close README2.md file
fReadMe.close()
