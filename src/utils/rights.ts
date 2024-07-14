interface IDestructRegistry {
    [user: string]: string[]
}

interface IStructRegistry {
    [right: string]: string[]
}

interface IRight {
    right: string,
    targets: string[]
}

interface IDestructRight {
    name: string,
    rights: string[]
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
            rights: value
        })
    }

    return destructRights
}

export function restructureRights(destructRights: IDestructRight[]): IRight[] {
    const rights: IRight[] = []
    const registry: IStructRegistry = {}

    for(const user of destructRights){
        for(const right of user.rights){
            if(right in registry){
                registry[`${right}`].push(user.name)
            }else{
                registry[`${right}`] = [user.name]
            }
        }
    }

    for(const [key, value] of Object.entries(registry)){
        rights.push({
            right: key,
            targets: value
        })
    }

    return rights
}