using System;

namespace Modello.Classi.Soccorso.Eventi
{
    public interface IEvento
    {
        string CodiceFonte { get; set; }
        DateTime Istante { get; set; }
    }
}