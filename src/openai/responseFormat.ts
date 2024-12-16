import z from 'zod';

const zodSchema = z.object({
    product: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        category: z.string(),
        manufacturer: z.object({
            name: z.string(),
            address: z.object({
                street: z.string(),
                city: z.string(),
                state: z.string(),
                postalCode: z.string(),
                country: z.string(),
            }),
            contact: z.object({
                phone: z.string(),
                 email: z.string(),
                website: z.string(),
            }),
        }),
        specifications: z.object({
            dimensions: z.object({
                width: z.string(),
                height: z.string(),
                depth: z.string(),
            }),
            weight: z.string(),
            materials: z.array(z.string()),
            battery: z.object({
                type: z.string(),
                capacity: z.string(),
                chargingTime: z.string(),
                batteryLife: z.string(),
            }),
            features: z.array(z.string()),
        }),
        pricing: z.object({
            currency: z.string(),
            price: z.number(),
            discount: z.object({
                isAvailable: z.boolean(),
                percentage: z.number(),
                validUntil: z.string(),
            }),
        }),
        availability: z.object({
            inStock: z.boolean(),
            stockCount: z.number(),
            warehouses: z.array(
                z.object({
                    location: z.string(),
                    stock: z.number(),
                })
            ),
        }),
        reviews: z.array(
            z.object({
                user: z.string(),
                rating: z.number(),
                comment: z.string(),
            })
        ),
        tags: z.array(
            z.string(),
        ),
        relatedProducts: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                url: z.string(),
                date: z.string(),
            })
        ),
    })
})

export default zodSchema;