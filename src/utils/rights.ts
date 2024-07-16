interface IDestructRegistry {
    [user: string]: string[]
}

interface IRight {
    right: string,
    targets: string[]
}

interface IRightProject {
    read: boolean,
    write: boolean,
    execute: boolean,
    special: boolean,
    targets: string[]
}

interface IDestructRight {
    name: string,
    role: string
}

export function destructureRights(rights: IRight[]): IDestructRight[] {
    const destructRights: IDestructRight[] = []
    const registry: IDestructRegistry = {}

    for(const right of rights){
        for(const target of right.targets){
            if(target in registry) {
                registry[`${target}`].push(right.right)
            }else{
                registry[`${target}`] = [right.right]
            }
        }
    }

    for(const [key, value] of Object.entries(registry)){
        destructRights.push({
            name: key,
            role: getRole(value)
        })
    }

    return destructRights
}

function getRole(rights: string[]): string {
    if(rights.includes("special")){
        return "admin"
    }else if(rights.includes("write")){
        return "write"
    }

    return "read"
}

export function restructureRights(destructRights: IDestructRight[]): IRight[] {
    const read: string[] = []
    const write: string[] = []
    const admin: string[] = []

    const rights = []

    for(const user of destructRights){
        switch(user.role){
            case "admin":
                read.push(user.name)
                write.push(user.name)
                admin.push(user.name)
                break;
            case "write":
                read.push(user.name)
                write.push(user.name)
                break;
            case "read":
                read.push(user.name)
        }
    }

    if(read.length > 0){
        rights.push({
            right: "read",
            targets: read
        })
    }
    if(write.length > 0){
        rights.push({
            right: "write",
            targets: write
        })
    }
    if(admin.length > 0){
        rights.push({
            right: "special",
            targets: admin
        })
    }

    return rights
}

/* TODO: This can be removed as soon as the rights management is refactored in the backend and expects the same data structure as all other security endpoints */
export function restructureRightsProjects(destructRights: IDestructRight[]): IRightProject[] {
    const read: string[] = []
    const write: string[] = []
    const admin: string[] = []

    const rights = []

    for(const user of destructRights){
        switch(user.role){
            case "admin":
                read.push(user.name)
                write.push(user.name)
                admin.push(user.name)
                break;
            case "write":
                read.push(user.name)
                write.push(user.name)
                break;
            case "read":
                read.push(user.name)
        }
    }

    if(read.length > 0){
        rights.push({
            read: true,
            write: false,
            execute: false,
            special: false,
            targets: read
        })
    }
    if(write.length > 0){
        rights.push({
            read: true,
            write: true,
            execute: true,
            special: false,
            targets: write
        })
    }
    if(admin.length > 0){
        rights.push({
            read: true,
            write: true,
            execute: true,
            special: true,
            targets: admin
        })
    }

    return rights
}
