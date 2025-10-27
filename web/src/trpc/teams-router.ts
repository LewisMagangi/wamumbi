import { procedure, router } from "./trpc";

export const teamsRouter = router({
  getOverview: procedure.query(async () => {
    try {
      // Since there's no Team model in schema, return sample data
      return [
        { id: "1", name: "Water Project Team", memberCount: 12, color: "#3B82F6" },
        { id: "2", name: "Education Team", memberCount: 8, color: "#10B981" },
        { id: "3", name: "Hunger Relief Team", memberCount: 15, color: "#EF4444" },
        { id: "4", name: "Healthcare Team", memberCount: 10, color: "#8B5CF6" }
      ];
    } catch (error) {
      console.error('Error fetching team overview:', error);
      return [];
    }
  }),

  getAll: procedure.query(async () => {
    try {
      // Since there's no Team model in schema, return sample data
      return [
        {
          id: "1",
          name: "Water Project Team",
          description: "Bringing clean water to communities",
          category: "Infrastructure",
          status: "active",
          membersCount: 12,
          projectsCount: 3,
          members: [
            { id: "1", name: "John Doe", profileImage: null, status: "active" },
            { id: "2", name: "Jane Smith", profileImage: null, status: "active" }
          ],
          createdAt: new Date()
        }
      ];
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }),

  getById: procedure.query(async () => {
      try {
        // Since there's no Team model in schema, return sample data
        return {
          id: "1",
          name: "Sample Team",
          description: "Sample team description",
          category: "General",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
          teamMembers: [],
          projects: [],
          members: []
        };
      } catch (error) {
        console.error('Error fetching team:', error);
        throw new Error('Failed to fetch team');
      }
    }),
});