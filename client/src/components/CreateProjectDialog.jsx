import { useState } from "react";
import { XIcon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { addProject, fetchWorkspaces } from "../features/workspaceSlice";
import toast from "react-hot-toast";
import api from "../configs/api";

const CreateProjectDialog = ({ isDialogOpen, setIsDialogOpen }) => {

    const dispatch = useDispatch();
    const { getToken } = useAuth();
    const { currentWorkspace } = useSelector((state) => state.workspace);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "",
        end_date: "",
        team_members: [],
        team_lead: "",
        progress: 0,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("CREATE CLICKED"); // 🔥 DEBUG

        try {
            if (!formData.team_lead) {
                return toast.error("Please select a team lead");
            }

            if (!currentWorkspace) {
                return toast.error("No workspace selected");
            }

            setIsSubmitting(true);

            const token = await getToken();

            const { data } = await api.post(
                "/api/projects",
                {
                    workspaceId: currentWorkspace.id,
                    ...formData
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // ✅ Update Redux instantly
            dispatch(addProject(data.project));

            // 🔥 IMPORTANT: Refresh everything
            await dispatch(fetchWorkspaces({ getToken }));

            toast.success("Project created successfully");

            setIsDialogOpen(false);

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeTeamMember = (email) => {
        setFormData((prev) => ({
            ...prev,
            team_members: prev.team_members.filter(m => m !== email)
        }));
    };

    if (!isDialogOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg text-zinc-900 dark:text-zinc-200 relative">

                <button
                    className="absolute top-3 right-3"
                    onClick={() => setIsDialogOpen(false)}
                >
                    <XIcon className="size-5" />
                </button>

                <h2 className="text-xl font-medium mb-1">Create New Project</h2>

                {currentWorkspace && (
                    <p className="text-sm mb-4">
                        In workspace: <span className="text-blue-500">{currentWorkspace.name}</span>
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Name */}
                    <input
                        type="text"
                        placeholder="Project Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded border"
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 rounded border"
                    />

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(false)}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        {/* 🔥 FIXED BUTTON */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !currentWorkspace}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            {isSubmitting ? "Creating..." : "Create Project"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateProjectDialog;