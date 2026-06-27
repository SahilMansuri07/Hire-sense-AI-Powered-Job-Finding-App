import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        is_delete: {
            type: Boolean,
            default: false,
        },

    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        collection: "skills",
    }
);

const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema);

export default Skill;