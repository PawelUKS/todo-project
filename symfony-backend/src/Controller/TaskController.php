<?php

namespace App\Controller;

use App\Service\UserService;
use App\Entity\Task;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/tasks', name: 'api_tasks_')]
class TaskController extends AbstractController
{
    #[Route('/generate-uuid', name: 'generate_uuid', methods: ['GET'])]
    public function generateUuid(UserService $UserService): JsonResponse
    {
        $uuid = $UserService->generateUuid();
        return $this->json(['uuid' => $uuid]);
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $userUuid = $request->query->get('userUuid');

        if (!$userUuid) {
            return $this->json(['error' => 'Missing user UUID'], 400);
        }

        $tasks = $entityManager->getRepository(Task::class)->findBy(['userId' => $userUuid]);

        $data = array_map(fn(Task $task) => [
            'id' => $task->getId(),
            'userId' => $task->getUserId(),
            'title' => $task->getTitle(),
            'isCompleted' => $task->isCompleted(),
            'createdAt' => $task->getCreatedAt()->format('Y-m-d H:i:s'),
        ], $tasks);

        return $this->json($data, 200, [], ['json_encode_options' => JSON_PRETTY_PRINT]);
    }

    #[Route('', name: 'create_task', methods: ['POST'])]
    public function createTask(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['userId']) || !isset($data['title'])) {
            return $this->json(['error' => 'Missing userId or title'], 400);
        }

        $task = new Task($data['userId'], $data['title']);
        $entityManager->persist($task);
        $entityManager->flush();

        $json = $serializer->serialize($task, 'json', ['groups' => 'task:read']);

        return new JsonResponse($json, 201, [], true);
    }

    #[Route('/{id}', name: 'update_task', methods: ['PUT'])]
    public function updateTask(int $id, Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $task = $entityManager->getRepository(Task::class)->find($id);

        if (!$task) {
            return $this->json(['error' => 'Task not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['title']) && !isset($data['isCompleted'])) {
            return $this->json(['error' => 'Nothing to update'], 400);
        }

        if (isset($data['title'])) {
            $task->setTitle($data['title']);
        }

        if (isset($data['isCompleted'])) {
            $task->setIsCompleted($data['isCompleted']);
        }

        $entityManager->flush();

        $json = $serializer->serialize($task, 'json', ['groups' => 'task:read']);

        return new JsonResponse($json, 200, [], true);
    }

    #[Route('/{id}', name: 'delete_task', methods: ['DELETE'])]
    public function deleteTask(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $task = $entityManager->getRepository(Task::class)->find($id);

        if (!$task) {
            return $this->json(['error' => 'Task not found'], 404);
        }

        $entityManager->remove($task);
        $entityManager->flush();

        return $this->json(['message' => 'Task deleted successfully']);
    }

    #[Route('/delete/all', name: 'delete_all_tasks', methods: ['DELETE'])]
    public function deleteAllTasks(EntityManagerInterface $entityManager): JsonResponse
    {
        $connection = $entityManager->getConnection();
        $connection->executeStatement('DELETE FROM task');

        return $this->json(['message' => 'All tasks deleted successfully']);
    }
}
