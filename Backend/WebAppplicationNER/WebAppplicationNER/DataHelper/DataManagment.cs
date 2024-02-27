namespace WebAppplicationNER.DataHelper
{
    public class DataManagment
    {
        public Food[] foods { get; set; }
        public Numbersjs[] numbers { get; set; }
        public DataManagment(string pathfood, string pathnumbers)
        {
            if (!File.Exists(pathfood))
            {
                File.Create(pathfood);

            }
            string alltext = File.ReadAllText(pathfood);
            foods = Newtonsoft.Json.JsonConvert.DeserializeObject<Food[]>(alltext);

            if (!File.Exists(pathnumbers))
            {
                File.Create(pathnumbers);

            }
            alltext = File.ReadAllText(pathnumbers);
            numbers = Newtonsoft.Json.JsonConvert.DeserializeObject<Numbersjs[]>(alltext);

        }
    }

}
