import os
import toml
import shutil

# Read the current version
f = open('pyproject.toml')
pyproject = toml.load(f)
f.close()
current_project_version = pyproject["project"]["version"]
print("Current project version: " + current_project_version)

# Ask for the new version
new_project_version = input("Enter the new version: ")
if float(new_project_version) <= float(current_project_version):
    raise ValueError("New version must be greater than current version")

pyproject["project"]["version"] = new_project_version

# Write the new version into pyproject.toml
f = open('pyproject.toml', 'w')
toml.dump(pyproject, f)
f.close()

# Update docs/conf.py
f = open('docs/conf.py')
conf = f.readlines()
f.close()

for i in range(len(conf)):
    if conf[i].startswith("version"):
        conf[i] = "version = '" + new_project_version + "'\n"
    elif conf[i].startswith("release"):
        conf[i] = "release = '" + new_project_version + "'\n"

f = open('docs/conf.py', 'w')
f.writelines(conf)
f.close()

# Remove dist folder
shutil.rmtree('dist')

# Build the package
os.system("python -m build")

# Commit and push
os.system("git add .")
os.system("git commit -m \"Publish version " + new_project_version + "\"")
os.system("git push")

# Load PyPI credentials from .env file
f = open('.env')
env = f.readlines()
f.close()

userN = env[0].split("=")[1].strip()
passW = env[1].split("=")[1].strip()

# Upload to PyPI by feeding username and password to twine from .env file
os.system("python -m twine upload --username " + userN + " --password " + passW + " dist/*")

print("Successfully published version " + new_project_version + " to PyPI")
