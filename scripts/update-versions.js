import fs from "fs"
import path from "path"

const services = ["frontend", "backend", "code-execution"]
const newVersion = process.argv[2]

if (!newVersion) {
  console.error("❌ Missing version argument")
  process.exit(1)
}

for (const service of services) {
  const pkgPath = path.join(process.cwd(), service, "package.json")
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
  pkg.version = newVersion
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
  console.log(`✅ Updated ${service}/package.json to version ${newVersion}`)
}
