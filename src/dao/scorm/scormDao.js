const prisma = require('../../config/prismaClient')

async function createResource({ module_id, uploaded_by, description, file_size }) {
    return await prisma.resource.create({
        data: {
            module_id,
            uploaded_by,
            description,
            file_size,
            resource_type: 'SCORM',
            url: '',
        }
    })
}


async function updateResourceUrl({id,url}){
return await prisma.resource.update({
    where: {id},
    data: {url},
})
}


module.exports = {
    createResource,
    updateResourceUrl
}