
// export function convertToSerializableObject({leanDocument}){
//     for (const key of Object.keys(leanDocument)){
//         leanDocument[key] = leanDocument[key].toString()
//     }
//     return leanDocument
// }

export function convertToSerializableObject(doc) {
	// handle null/primitive
	if (doc === null || typeof doc !== 'object') return doc

	// arrays
	if (Array.isArray(doc)) return doc.map(convertToSerializableObject)

	// objects
	const out = {}
	for (const [key, val] of Object.entries(doc)) {
		if (val === null || typeof val !== 'object') {
			out[key] = val
			continue
		}

		// Date -> ISO string
		if (val instanceof Date) {
			out[key] = val.toISOString()
			continue
		}

		// BSON ObjectId detection (common in mongoose objects)
		if (
			val?._bsontype === 'ObjectID' ||
			typeof val?.toHexString === 'function'
		) {
			out[key] = String(val)
			continue
		}

		// fallback: recurse
		out[key] = convertToSerializableObject(val)
	}

	return out
}