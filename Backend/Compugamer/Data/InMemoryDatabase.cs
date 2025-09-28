using System.Collections.Generic;
using Compugamer.Data.Models;

namespace Compugamer.Data
{
    public static class InMemoryDatabase
    {
        public static List<Bus> Buses { get; } = new();
        public static List<Student> Students { get; } = new();
        public static List<Driver> Drivers { get; } = new();
    }
}