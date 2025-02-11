<template>
    <div v-if="showLabel && user" class="flex flex-row items-center gap-2">
        <Avatar
            :label="user?.full_name"
            :image="user?.user_image"
            :size="props.size"
        />
        <div class="text-base text-gray-800 grow">
            {{ user?.full_name }}
        </div>
    </div>

    <Avatar
        v-else
        :label="user?.full_name || 'Unknown User'"
        :image="user?.user_image || defaultAvatarImage"
        :size="props.size"
    />
</template>

<script setup>
import { ref, watch, onMounted } from "vue"
import { Avatar } from "frappe-ui"
import { userResource } from "@/data/user"


const defaultAvatarImage = 'path/to/default/avatar/image.png'

const props = defineProps({
    userID: {
        type: String,
        required: false,
    },
    size: {
        type: String,
        default: "sm",
    },
    showLabel: {
        type: Boolean,
        default: false,
    },
})
console.log('user avtar', props.userID)

const user = ref(null)

const fetchUser = async (userID) => {
    try {
        console.log(`Fetching user info for userID: ${userID}`)
        const response = await userResource.fetch({ user_id: userID })
        console.log("API response:", response)
        user.value = response.data
    } catch (error) {
        console.error("Error fetching user info:", error)
        user.value = null
    }
}

watch(
    () => props.userID,
    (newUserID) => {
        if (newUserID) {
            fetchUser(newUserID)
        } else {
           
            fetchUser()
        }
    },
    { immediate: true }
)

onMounted(() => {
    if (!props.userID) {
        fetchUser()
    }
})
</script>
